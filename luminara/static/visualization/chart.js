var matrix = function(where, type, params){
    var dataSet, addData, socket, colors, antiFloodTimer, margin, width, height, buckets, getData, getAxis,
        legendElementWidth, init, drawAntiFlood, draw, svg, legend, subscriptionVector;

//----- CONFIG -----//
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]; // alternatively colorbrewer.YlGnBu[9]
    margin = { top: 120, right: 0, bottom: 100, left: 120 };
    width = 1000 - margin.left - margin.right + 5;
    height = 700 - margin.top - margin.bottom + 5;
    buckets = 9;
    legendElementWidth = 40;
//----- CONFIG -----//



    socket = io("http://atlas-stream.ripe.net:80", { path : "/stream/socket.io" });
    socket.on("atlas_error", function(result) {
        console.log(result);
    });

    dataSet = {
        sources: {},
        targets: {},
        links: {}
    };

    addData = function(source, target){
        var linkKey;

        if (!dataSet.sources[source.id]){
            dataSet.sources[source.id] = {
                "name": source.id,
                "group": source.as
            };
        }

        if (!dataSet.targets[target.id]){
            dataSet.targets[target.id] = {
                "name": target.id,
                "group": target.as
            };
        }

        linkKey = source.id + "-" + target.id;
        if (!dataSet.links[linkKey]){
            dataSet.links[linkKey] = {
                "source": source.id,
                "target": target.id,
                "value": 0
            };
        } else {
            dataSet.links[linkKey]["value"] ++;
        }
    };

    getData = function(){
        return $.map(dataSet.links, function(item){
            return item;
        });
    };

    getAxis = function(){
        return {
            xAxis: Object.keys(dataSet.sources),
            yAxis:  Object.keys(dataSet.targets)
        }
    };

    init = function() {
        svg = d3.select(where).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        legend = svg.selectAll(".legend")
            .data(colors);

        legend.enter().append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", function (d, i) {
                return legendElementWidth * i;
            })
            .attr("y", height + 40)
            .attr("width", 40)
            .attr("height", 10)
            .style("fill", function (d, i) {
                return colors[i];
            });

        legend
            .append("text")
            .attr("class", "mono")
            .text(function (d, i) {
                return "≥ " + Math.round(i * 5);
            })
            .attr("x", function (d, i) {
                return legendElementWidth * i;
            })
            .attr("y", height + 60);

        legend.exit().remove();

        socket.on("atlas_result", function (result) {
            if (result.dst_addr) {
                addData({
                    id: result.from,
                    as: 1
                }, {
                    id: result.dst_addr,
                    as: 1
                });

                drawAntiFlood(getData());
            } else {
                console.log("DNS resolution failed: ", result);
            }
        });

        switch (type) {
            case "msm":
                subscriptionVector = {
                    stream_type: "result",
                    sendBacklog: true
                };

                for (var n = 0, length = params.msm.length; n < length; n++) {
                    subscriptionVector.msm = params.msm[n];
                    socket.emit("atlas_subscribe", subscriptionVector);
                }
                break;

            case "prefix":

                for (var n = 0, length = params.prefixes.length; n < length; n++) {
                    subscriptionVector = {
                        stream_type: "result",
                        type: "traceroute",
                        passThroughPrefix: params.prefixes[n]
                    };

                    socket.emit("atlas_subscribe", subscriptionVector);
                }
                break;

            default:
                alert("define something to listen on the html file");

        }
    };

    drawAntiFlood = function(data){
        if (antiFloodTimer){
            clearTimeout(antiFloodTimer)
        }
        antiFloodTimer = setTimeout(function(){
            draw(data);
        }, 200);
    };

    draw = function(data){
        var axis, dayLabels, gridSize, timeLabels, cards,

            axis = getAxis();

        gridSize = Math.ceil(Math.min((width/axis.xAxis.length), (height/axis.yAxis.length)));

        dayLabels = svg
            .selectAll(".dayLabel")
            .data(axis.yAxis);

        dayLabels
            .enter()
            .append("text")
            .text(function (d) { return d; });

        dayLabels
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 2 + ")")
            .attr("class", "dayLabel mono axis");

        timeLabels = svg.selectAll(".timeLabel")
            .data(axis.xAxis);

        timeLabels
            .enter()
            .append("text")
            .style("text-anchor", "start")
            .text(function(d) { return d; });

        timeLabels
            .attr("transform", function(d, i){
                var x, y;

                x = (((i * gridSize)) + (gridSize/2 + 4));
                y = "-10";
                return "translate(" + x + ", " + y + ")  rotate(-90) ";//rotate(90, " + x + ", " + y + ")
            })
            .attr("class", "timeLabel mono axis");

        //
        // var colorScale = d3.scale.quantile()
        //     .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
        //     .range(colors);

        cards = svg.selectAll(".hour")
            .data(data, function(d) {return d.source + ':' + d.target;});

        cards.append("title");

        cards
            .enter()
            .append("rect")
            .attr("class", "hour bordered")
            .attr("rx", 2)
            .attr("ry", 2);

        cards
            .attr("x", function(d) { return (axis.xAxis.indexOf(d.source)) * gridSize; })
            .attr("y", function(d) { return (axis.yAxis.indexOf(d.target)) * gridSize; })
            .attr("width", gridSize) // -2 for borders
            .attr("height", gridSize);

        cards
            .transition()
            .duration(1000)
            .style("fill", function(d, i) {
                return colors[Math.floor(d.value/5)];
            });

        cards.select("title").text(function(d) { return d.value; });
        cards.exit().remove();
    };

    $(document).ready(function(){
        init();
    });
};

