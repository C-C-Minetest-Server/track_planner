"use strict";

let nodeElements = new Object();
let TrackMap = new Object();

window.DeleteTrackAt = (x, y) => {
    if (TrackMap[x] === undefined) return;
    delete TrackMap[x][y];
    if ($.isEmptyObject(TrackMap[x]))
        delete TrackMap[x];
};

// trackType: { TrackType, TrackRotation }
window.SetTrackAt = (x, y, trackType) => {
    if (trackType === null || trackType[0] === 0) return window.DeleteTrackAt(x, y);

    if (TrackMap[x] === undefined) TrackMap[x] = new Object();
    TrackMap[x][y] = trackType.slice(0);
};

window.GetTrackAt = (x, y) => {
    if (TrackMap[x] === undefined) return [0, 0];
    if (TrackMap[x][y] === undefined) return [0, 0];
    return TrackMap[x][y].slice(0);
};

window.UpdateTrackAt = (x, y) => {
    if (nodeElements[x] === undefined || nodeElements[x][y] === undefined) return;
    const nodeData = window.GetTrackAt(x, y);
    const trackType = window.TrackTypes[nodeData[0]]
    if (trackType === undefined) {
        window.DeleteTrackAt(x, y);
        window.UpdateTrackAt(x, y);
        return;
    }

    const $nodeContent = $("<div>")
        .addClass("trackPlannerNodeContent");

    nodeElements[x][y].html($nodeContent);
    nodeElements[x][y].attr("data-track-rotation", trackType[1][nodeData[1]]);
    nodeElements[x][y].attr("data-track-type", trackType[0]);
};

window.UpdateVisibleTracks = () => {
    for (let elemX in nodeElements) {
        for (let elemY in nodeElements[elemX]) {
            window.UpdateTrackAt(elemX, elemY);
        }
    }
}

window.ImportTracks = (data) => {
    TrackMap = data;
}

window.NormalizeTracks = () => {
    const smallestX = Math.min(...Object.keys(TrackMap))
    const smallestY = Math.min(...[].concat(...Object.keys(TrackMap).map((key) => Object.keys(TrackMap[key]))))

    const newMap = new Object();
    for (let elemX in TrackMap) {
        const newMapY = new Object();
        for (let elemY in TrackMap[elemX]) {
            newMapY[elemY - smallestY + 1] = TrackMap[elemX][elemY];
        }
        newMap[elemX - smallestX + 1] = newMapY;
    }
    TrackMap = newMap;
    window.UpdateVisibleTracks();
}

const CurveTrackRotation = [
    "0",
    "30",
    "45",
    "60",
    "90",
    "120",
    "135",
    "150",
    "180",
    "210",
    "225",
    "240",
    "270",
    "300",
    "315",
    "330",
];
const BooleanRotation = [
    "0",
    "1",
];

window.TrackTypes = [
    [
        "none",
        [0]
    ],

    [
        "st",
        [
            "0",
            "30",
            "45",
            "60",
            "90",
            "120",
            "135",
            "150",
        ],
        "advtrains:dtrack",
    ],
    [
        "cr",
        CurveTrackRotation,
        "advtrains:dtrack",
    ],
    [
        "swlst",
        CurveTrackRotation,
        "advtrains:dtrack",
    ],
    [
        "swrst",
        CurveTrackRotation,
        "advtrains:dtrack",
    ],

    [
        "xing90plusx_30l",
        BooleanRotation,
        "advtrains:dtrack_xing90plusx"
    ],
    [
        "xing90plusx_45l",
        BooleanRotation,
        "advtrains:dtrack_xing90plusx"
    ],
    [
        "xing90plusx_60l",
        BooleanRotation,
        "advtrains:dtrack_xing90plusx"
    ],
    [
        "xing90plusx_60r",
        BooleanRotation,
        "advtrains:dtrack_xing90plusx"
    ],
    [
        "xing90plusx_45r",
        BooleanRotation,
        "advtrains:dtrack_xing90plusx"
    ],
    [
        "xing90plusx_30r",
        BooleanRotation,
        "advtrains:dtrack_xing90plusx"
    ],

    [
        "xingdiag_30l45r",
        BooleanRotation,
        "advtrains:dtrack_xingdiag"
    ],
    [
        "xingdiag_60l30l",
        BooleanRotation,
        "advtrains:dtrack_xingdiag"
    ],
    [
        "xingdiag_60l45r",
        BooleanRotation,
        "advtrains:dtrack_xingdiag"
    ],
    [
        "xingdiag_60l60r",
        BooleanRotation,
        "advtrains:dtrack_xingdiag"
    ],
    [
        "xingdiag_60r45l",
        BooleanRotation,
        "advtrains:dtrack_xingdiag"
    ],
    [
        "xingdiag_60r30r",
        BooleanRotation,
        "advtrains:dtrack_xingdiag"
    ],
    [
        "xingdiag_30r45l",
        BooleanRotation,
        "advtrains:dtrack_xingdiag"
    ],

    [
        "xing_st",
        [
            "0",
            "30",
            "45",
            "60",
        ],
        "advtrains:dtrack_xing"
    ],

    [
        "sy",
        CurveTrackRotation,
        "advtrains:dtrack_sy"
    ],
    [
        "s3",
        CurveTrackRotation,
        "advtrains:dtrack_s3"
    ],
];

window.TrackGroups = {
    "advtrains:dtrack": {
        name: "Track",
        texture: "advtrains_dtrack_placer.png",
    },
    "advtrains:dtrack_xing90plusx": {
        name: "90+Angle Diamond Crossing Track",
        texture: "advtrains_dtrack_xing4590_placer.png",
    },
    "advtrains:dtrack_xingdiag": {
        name: "Diagonal Diamond Crossing Track",
        texture: "advtrains_dtrack_xingdiag_placer.png",
    },
    "advtrains:dtrack_xing": {
        name: "Perpendicular Diamond Crossing Track",
        texture: "advtrains_dtrack_xing_placer.png",
    },
    "advtrains:dtrack_sy": {
        name: "Y-turnout",
        texture: "advtrains_dtrack_sy_placer.png",
    },
    "advtrains:dtrack_s3": {
        name: "3-way turnout",
        texture: "advtrains_dtrack_s3_placer.png",
    },
};

$(function () {
    let nodeSize = 50;

    let currentX = 0;
    let currentY = 0;

    $("#loadingText").remove();

    $licenseDialog = $("#licenseDialog");
    $licenseDialogOpen = $("#licenseDialogOpen");

    $($licenseDialogOpen).on("click", (e) => {
        e.preventDefault();
        $licenseDialog.show();
    });

    $("#licenseDialogClose").on("click", (e) => {
        $licenseDialog.hide();
    });

    $(document).click(function(e) {
        // https://stackoverflow.com/a/10851375/12805899, https://creativecommons.org/licenses/by-sa/3.0/
        if (!$(e.target).closest($licenseDialog).length && !$(e.target).closest($licenseDialogOpen).length) {
            $licenseDialog.hide();
        }
    });

    const parsedHash = new URLSearchParams(window.location.hash.substring(1));
    let modified = false;

    const $positionIndicatorX = $("#positionIndicatorX");
    const $positionIndicatorY = $("#positionIndicatorY");
    const $positionIndicatorHoveredX = $("#positionIndicatorHoveredX");
    const $positionIndicatorHoveredY = $("#positionIndicatorHoveredY");
    const $positionIndicatorClickedX = $("#positionIndicatorClickedX");
    const $positionIndicatorClickedY = $("#positionIndicatorClickedY");

    function updateScreen() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const maxX = Math.ceil((width - currentX) / nodeSize);
        const minX = Math.floor(-currentX / nodeSize);
        const maxY = Math.ceil((height - currentY) / nodeSize);
        const minY = Math.floor(-currentY / nodeSize);

        $positionIndicatorX.text(minX);
        $positionIndicatorY.text(minY);

        for (let elemX in nodeElements) {
            if (elemX < minX || elemX > maxX) {
                for (let elemY in nodeElements[elemX]) {
                    let $node = nodeElements[elemX][elemY];
                    $node.fadeOut(400, () => $node.remove());
                }
                delete nodeElements[elemX];
            } else {
                for (let elemY in nodeElements[elemX]) {
                    if (elemY < minY || elemY > maxY) {
                        let $node = nodeElements[elemX][elemY];
                        $node.fadeOut(400, () => $node.remove());
                        delete nodeElements[elemX][elemY];
                    }
                }
            }
        }

        for (let elemX = minX; elemX <= maxX; elemX++) {
            if (nodeElements[elemX] === undefined) nodeElements[elemX] = new Object();
            for (let elemY = minY; elemY <= maxY; elemY++) {
                if (nodeElements[elemX][elemY] === undefined) {
                    nodeElements[elemX][elemY] = $("<div>")
                        .addClass("trackPlannerNode")
                        .attr({
                            "data-node-x": elemX,
                            "data-node-y": elemY,
                        })
                        .css({
                            "width": (nodeSize - 2) + "px",
                            "height": (nodeSize - 2) + "px",
                            "max-width": (nodeSize - 2) + "px",
                            "max-height": (nodeSize - 2) + "px",
                            "left": elemX * nodeSize,
                            "top": elemY * nodeSize,
                        })
                        .hide()
                        .fadeIn("slow")
                        .appendTo($container);
                    window.UpdateTrackAt(elemX, elemY);
                }
            }
        }
    }

    const $container = $("#trackPlannerContainer");
    $container.draggable({
        cursor: "grab",
        drag: (event, ui) => {
            const position = ui.position;
            currentX = position.left;
            currentY = position.top;
            updateScreen();
        },
        start: () => $container.data("dragging", true),
    });

    function centerContainer() {
        $container.animate({
            left: "0",
            right: "0",
            top: "0",
            bottom: "0",
        });
        currentX = 0;
        currentY = 0;
        updateScreen();
    }

    function loadPreset(preset) {
        $.ajax('./presets/' + preset + '.json', {
            dataType: "json",
        }).done(function (data) {
            window.ImportTracks(data);
            window.NormalizeTracks();
            window.UpdateVisibleTracks();
            centerContainer();
        });
        parsedHash.set("preset", preset);
        window.location.hash = "#" + parsedHash.toString();
    }

    const $thisTrackInfo = $("#thisTrackInfo");
    const $thisTrackTexture = $("#thisTrackTexture");
    const $thisTrackName = $("#thisTrackName");
    const $thisTrackItem = $("#thisTrackItem");

    function updateTrackInfo(elemX, elemY) {
        const nodeData = window.GetTrackAt(elemX, elemY);
        if (nodeData[0] == 0) {
            $thisTrackInfo.hide();
        } else {
            const TrackID = window.TrackTypes[nodeData[0]][2];
            const TrackData = window.TrackGroups[TrackID];
            $thisTrackTexture.attr("src", "./img/placers/" + TrackData.texture);
            $thisTrackName.text(TrackData.name);
            $thisTrackItem.text(TrackID + "_placer");
            $thisTrackInfo.show();
        }
    }

    $container.on("mouseenter", ".trackPlannerNode", function () {
        const $this = $(this);
        const elemX = $this.attr("data-node-x");
        const elemY = $this.attr("data-node-y");

        $positionIndicatorHoveredX.text(elemX);
        $positionIndicatorHoveredY.text(elemY);

        updateTrackInfo(elemX, elemY);
    });


    $container.on("click", ".trackPlannerNode", function () {
        if ($container.data("dragging")) {
            $container.removeData("dragging");
            return;
        }

        const $this = $(this);
        const elemX = $this.attr("data-node-x");
        const elemY = $this.attr("data-node-y");

        $positionIndicatorClickedX.text(elemX);
        $positionIndicatorClickedY.text(elemY);

        const nodeData = window.GetTrackAt(elemX, elemY);
        nodeData[0]++;
        nodeData[0] %= window.TrackTypes.length;
        nodeData[1] %= window.TrackTypes[nodeData[0]][1].length;
        window.SetTrackAt(elemX, elemY, nodeData);
        window.UpdateTrackAt(elemX, elemY);
        modified = true;
        updateTrackInfo(elemX, elemY);
    });

    $container.on("contextmenu", ".trackPlannerNode", function (e) {
        e.preventDefault();

        const $this = $(this);
        const elemX = $this.attr("data-node-x");
        const elemY = $this.attr("data-node-y");

        let nodeData = window.GetTrackAt(elemX, elemY);
        nodeData[1]++;
        nodeData[1] %= window.TrackTypes[nodeData[0]][1].length;
        window.SetTrackAt(elemX, elemY, nodeData);
        window.UpdateTrackAt(elemX, elemY);
        modified = true;
    });

    $("#trackImportPresets").on("change", function () {
        if (modified && !confirm("Override existing data with imported file?")) {
            $(this).prop('selectedIndex', 0);
            return;
        }

        const target = this.value;
        if (target === undefined)
            return;

        if (target == "clear") {
            window.ImportTracks({});
            window.UpdateVisibleTracks();
            parsedHash.delete("preset");
            window.location.hash = "#" + parsedHash.toString();
        } else loadPreset(target);
        $(this).prop('selectedIndex', 0);
        modified = false;
    });

    $("#trackImport").on("change", function () {
        if (modified && !confirm("Override existing data with imported file?"))
            return;
        const $this = $(this);
        const file = $this.prop("files")[0];
        if (file === undefined)
            return;

        const fr = new FileReader();
        fr.onload = (e) => {
            const data = JSON.parse(e.target.result);
            if (data) {
                window.ImportTracks(data);
                window.UpdateVisibleTracks();
            }
        }
        fr.readAsText(file);
        modified = false;
    })

    $("#trackExport").on("click", function () {
        window.NormalizeTracks();
        window.UpdateVisibleTracks();
        centerContainer();
        const blob = new Blob([JSON.stringify(TrackMap)], { type: "text/json" });
        const $btn = $("<a>")
            .attr("href", window.URL.createObjectURL(blob))
            .attr("download", "track_planner.json")
            .hide()
            .appendTo("body");
        $btn[0].click();
        $btn.remove();
        modified = false;
    })

    $("#trackPlannerCenter").on("click", () => {
        window.NormalizeTracks();
        window.UpdateVisibleTracks();
        centerContainer();
    })

    $(window).on('resize', updateScreen);
    updateScreen();

    if (parsedHash.get("preset") !== null) {
        loadPreset(parsedHash.get("preset"));
    }

    window.addEventListener("beforeunload", (e) => {
        if (modified)
            e.preventDefault();
    });

})