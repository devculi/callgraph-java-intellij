const options = {
    nodes: {
        shape: "ellipse", // Glass orb shape
        size: 25,
        font: {
            multi: "md",
            color: "rgba(255, 255, 255, 0.95)",
            size: 14,
            face: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            strokeWidth: 0,
            strokeColor: "rgba(0, 0, 0, 0.5)"
        },
        borderWidth: 2,
        borderWidthSelected: 3,
        color: {
            border: "rgba(0, 255, 255, 0.4)", // Cyan glow border
            background: "rgba(0, 150, 200, 0.12)", // Semi-transparent teal
            highlight: {
                border: "rgba(0, 255, 255, 0.8)", // Bright cyan on selection
                background: "rgba(0, 200, 255, 0.25)"
            },
            hover: {
                border: "rgba(0, 255, 255, 0.6)", // Cyan glow on hover
                background: "rgba(0, 180, 220, 0.18)"
            }
        },
        shadow: {
            enabled: true,
            color: "rgba(0, 255, 255, 0.3)",
            size: 15,
            x: 0,
            y: 0
        },
        shapeProperties: {
            borderRadius: 8,
            interpolation: true
        },
        scaling: {
            min: 15,
            max: 40,
            label: {
                enabled: true,
                min: 12,
                max: 18
            }
        }
    },
    edges: {
        arrows: {
            to: {
                enabled: true,
                scaleFactor: 0.8,
                type: "arrow"
            },
        },
        color: {
            color: "rgba(138, 100, 226, 0.4)", // Soft purple/violet
            highlight: "rgba(200, 100, 255, 0.8)", // Bright neon purple on selection
            hover: "rgba(170, 100, 240, 0.6)", // Purple glow on hover
            inherit: false,
            opacity: 0.7
        },
        width: 2,
        selectionWidth: 4,
        hoverWidth: 3,
        smooth: {
            enabled: true,
            type: "continuous", // Creates flowing, curved edges
            roundness: 0.6
        },
        font: {
            color: "rgba(255, 255, 255, 0.8)",
            size: 11,
            face: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            strokeWidth: 3,
            strokeColor: "rgba(0, 0, 0, 0.6)",
            align: "middle"
        },
        shadow: {
            enabled: true,
            color: "rgba(138, 100, 226, 0.3)",
            size: 8,
            x: 0,
            y: 0
        }
    },
    interaction: {
        zoomSpeed: 0.25,
        hover: true,
        hoverConnectedEdges: true,
        selectConnectedEdges: true,
        tooltipDelay: 200,
        navigationButtons: false,
        keyboard: {
            enabled: true,
            speed: {x: 10, y: 10, zoom: 0.02},
            bindToWindow: false
        }
    },
    physics: {
        enabled: false,
        barnesHut: {
            theta: 0.5,
            gravitationalConstant: -3000,
            springLength: 120,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0.5
        },
        solver: 'barnesHut',
        stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 25,
            fit: true
        }
    },
    layout: {
        randomSeed: 0,
        improvedLayout: true,
        hierarchical: {
            enabled: false
        }
    }
};

module.exports = options;