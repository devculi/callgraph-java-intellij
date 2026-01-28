import vis from "vis-network/standalone/umd/vis-network.min.js";
import options from "./vis-options";
import "@fortawesome/fontawesome-free/css/all.min.css";

window.JavaBridge = {
    goToSource: (referenceHashCode) => {
    },
    saveAsHtml: (unused) => {
    },
    generateGraph: (unused) => {
    },
    openSettings: (unused) => {
    }
}

const messageElement = document.getElementById("message");
const networkElement = document.getElementById("network");
const generateMessage = document.getElementById("generateMessage");
const showAllButton = document.getElementById("showAllButton");

const network = new vis.Network(networkElement, {}, options);
let hiddenNodes = new Set();
let selectedNodeId = null;
let isGraphFitted = false;
let isGraphGenerated = false;
let pulseTimeoutId = null;
let illuminateTimeoutId = null;

// Create ripple animation style once
const rippleStyle = document.createElement('style');
rippleStyle.id = 'ripple-animation';
rippleStyle.textContent = `
    @keyframes ripple-expand {
        0% {
            width: 20px;
            height: 20px;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
            border-width: 1px;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Enhanced interaction with liquid glass effects
network.on("click", function (params) {
    // Add ripple effect on click
    createRippleEffect(params.pointer.DOM.x, params.pointer.DOM.y);
    
    if (params.nodes.length === 1) {
        selectedNodeId = params.nodes[0];
        JavaBridge.goToSource(params.nodes[0]);
        // Pulse the selected node
        pulseNode(params.nodes[0]);
    } else {
        selectedNodeId = null;
    }
    if (params.edges.length === 1) {
        JavaBridge.goToSource(params.edges[0]);
        // Illuminate the selected edge
        illuminateEdge(params.edges[0]);
    }
    updateButtonVisibility();
});

network.on("hoverNode", function(params) {
    // Add glow effect to hovered node
    const nodeId = params.node;
    const node = network.body.data.nodes.get(nodeId);
    if (node) {
        network.body.data.nodes.update({
            id: nodeId,
            shadow: {
                enabled: true,
                color: "rgba(0, 255, 255, 0.6)",
                size: 25,
                x: 0,
                y: 0
            }
        });
    }
});

network.on("blurNode", function(params) {
    // Remove enhanced glow when not hovering
    const nodeId = params.node;
    const node = network.body.data.nodes.get(nodeId);
    if (node) {
        network.body.data.nodes.update({
            id: nodeId,
            shadow: {
                enabled: true,
                color: "rgba(0, 255, 255, 0.3)",
                size: 15,
                x: 0,
                y: 0
            }
        });
    }
});

network.on("stabilizationProgress", function (params) {
    const message = "Stabilization progress: " + Math.round(params.iterations / params.total * 100) + "%";
    showMessage(message);
});

network.on("stabilizationIterationsDone", function () {
    hideMessage();
    isGraphGenerated = true;
    fit();
    showGraphControls();
});

network.on("fit", () => {
    isGraphFitted = true;
    updateButtonVisibility();
});

network.on("dragEnd", () => {
    isGraphFitted = false;
    updateButtonVisibility();
});

network.on("zoom", () => {
    isGraphFitted = false;
    updateButtonVisibility();
});

// Liquid glass animation functions
function createRippleEffect(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.borderRadius = '50%';
    ripple.style.border = '2px solid rgba(0, 255, 255, 0.6)';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'ripple-expand 0.6s ease-out';
    ripple.style.zIndex = '999';
    
    networkElement.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

function pulseNode(nodeId) {
    // Create a pulsing animation for selected node
    const node = network.body.data.nodes.get(nodeId);
    if (!node) return;
    
    // Cancel previous timeout if exists
    if (pulseTimeoutId) {
        clearTimeout(pulseTimeoutId);
    }
    
    // Store original shadow or use default
    const originalShadow = node.shadow || {
        enabled: true,
        color: "rgba(0, 255, 255, 0.3)",
        size: 15,
        x: 0,
        y: 0
    };
    
    // Pulse effect
    network.body.data.nodes.update({
        id: nodeId,
        shadow: {
            enabled: true,
            color: "rgba(0, 255, 255, 0.9)",
            size: 30,
            x: 0,
            y: 0
        }
    });
    
    pulseTimeoutId = setTimeout(() => {
        const currentNode = network.body.data.nodes.get(nodeId);
        if (currentNode) {
            network.body.data.nodes.update({
                id: nodeId,
                shadow: originalShadow
            });
        }
    }, 300);
}

function illuminateEdge(edgeId) {
    // Create an illumination effect for selected edge
    const edge = network.body.data.edges.get(edgeId);
    if (!edge) return;
    
    // Cancel previous timeout if exists
    if (illuminateTimeoutId) {
        clearTimeout(illuminateTimeoutId);
    }
    
    // Store original colors or use defaults
    const originalColor = edge.color || {
        color: "rgba(138, 100, 226, 0.4)",
        highlight: "rgba(200, 100, 255, 0.8)"
    };
    const originalShadow = edge.shadow || {
        enabled: true,
        color: "rgba(138, 100, 226, 0.3)",
        size: 8,
        x: 0,
        y: 0
    };
    
    network.body.data.edges.update({
        id: edgeId,
        color: {
            color: "rgba(200, 100, 255, 0.9)",
            highlight: "rgba(200, 100, 255, 0.9)"
        },
        width: 4,
        shadow: {
            enabled: true,
            color: "rgba(200, 100, 255, 0.6)",
            size: 15,
            x: 0,
            y: 0
        }
    });
    
    illuminateTimeoutId = setTimeout(() => {
        const currentEdge = network.body.data.edges.get(edgeId);
        if (currentEdge) {
            network.body.data.edges.update({
                id: edgeId,
                color: originalColor,
                width: 2,
                shadow: originalShadow
            });
        }
    }, 500);
}

function hideSelectedNode() {
    if (selectedNodeId !== null) {
        hiddenNodes.add(selectedNodeId);
        network.body.data.nodes.update({id: selectedNodeId, hidden: true});
        selectedNodeId = null;
        updateShowAllButton();
        updateButtonVisibility();
    }
}

function showAllNodes() {
    if (hiddenNodes.size > 0) {
        const hiddenNodesArray = Array.from(hiddenNodes);
        hiddenNodesArray.forEach(nodeId => {
            network.body.data.nodes.update({id: nodeId, hidden: false});
        });
        hiddenNodes.clear();
        updateShowAllButton();
    }
}

function updateShowAllButton() {
    if (hiddenNodes.size > 0) {
        showAllButton.classList.remove("hidden");
    } else {
        showAllButton.classList.add("hidden");
    }
}

function updateButtonVisibility() {
    const fitButton = document.querySelector('button[onclick="fit()"]');
    const hideNodeButton = document.querySelector('button[onclick="hideSelectedNode()"]');
    
    if (fitButton) {
        if (!isGraphGenerated || isGraphFitted) {
            fitButton.classList.add("hidden");
        } else {
            fitButton.classList.remove("hidden");
        }
    }
    
    if (hideNodeButton) {
        if (selectedNodeId !== null) {
            hideNodeButton.classList.remove("hidden");
        } else {
            hideNodeButton.classList.add("hidden");
        }
    }
}

function showMessage(message) {
    if (!message || message.trim() === '') {
        message = "Place your caret on a method, right-click, or use Alt+Shift+E shortcut to generate a call graph.";
    }
    messageElement.innerHTML = message;
    messageElement.classList.remove("hidden");
    networkElement.classList.add("hidden");
}

function hideMessage() {
    messageElement.classList.add("hidden");
    networkElement.classList.remove("hidden");
}

function showGraphControls() {
    for (let generatedGraphController of document.getElementsByClassName("generatedGraphController")) {
        generatedGraphController.classList.remove("hidden");
    }
    updateShowAllButton();
    updateButtonVisibility();
}

function hideGraphControls() {
    for (let generatedGraphController of document.getElementsByClassName("generatedGraphController")) {
        generatedGraphController.classList.add("hidden");
    }
}

function updateNetwork(data) {
    hideGraphControls();
    hiddenNodes.clear();
    selectedNodeId = null;
    isGraphFitted = false;
    isGraphGenerated = false;
    updateShowAllButton();
    showMessage("Rendering graph...");
    try {
        options.groups = data.groups;
        network.setOptions(options);
        network.setData(data);
        network.stabilize();
    } catch (e) {
        showMessage(e);
    }
}

function fit() {
    network.fit({
        animation: {
            duration: 800,
            easingFunction: "easeInOutQuad"
        }
    });
    isGraphFitted = true;
    updateButtonVisibility();
}

const MESSAGE_TYPE_SUCCESS = "+";
const MESSAGE_TYPE_ERROR = "-";

function setGenerateMessage(message) {
    if (!message || message.trim() === '') {
        message = "-PLACE YOUR CARET ON A METHOD";
    }
    
    let messageTypeFlag = message.substring(0, 1);
    let classToSet = "navbuttonMessage "
    if (messageTypeFlag === MESSAGE_TYPE_SUCCESS) {
        classToSet += "navbuttonMessage-success";
    } else if (messageTypeFlag === MESSAGE_TYPE_ERROR) {
        classToSet += "navbuttonMessage-error";
    }
    generateMessage.className = classToSet;
    generateMessage.innerHTML = message.substring(1);
}

function updateMessageTextColor(backgroundColor) {
    backgroundColor = backgroundColor.replace('#', '');
    
    const r = parseInt(backgroundColor.substr(0, 2), 16);
    const g = parseInt(backgroundColor.substr(2, 2), 16);
    const b = parseInt(backgroundColor.substr(4, 2), 16);
    
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    if (brightness > 0.5) {
        messageElement.style.color = "black";
    } else {
        messageElement.style.color = "white";
    }
}

function resetDefaultMessages() {
    showMessage();
    setGenerateMessage();
}

window.updateNetwork = updateNetwork;
window.fit = fit;
window.showMessage = showMessage;
window.setGenerateMessage = setGenerateMessage;
window.updateMessageTextColor = updateMessageTextColor;
window.resetDefaultMessages = resetDefaultMessages;
window.hideSelectedNode = hideSelectedNode;
window.showAllNodes = showAllNodes;

resetDefaultMessages();
updateButtonVisibility();