// Set global variables
let dataset
let simulation, nodes

// --------------------------------------------
        // Import the data
// --------------------------------------------

loadData().then(data => {
    dataset = data
    
    setTimeout(setup_page(), 100) 
 })
 
 async function loadData() {
    try {
        const stateData = await d3.csv('./data/LanguageData_States.csv', function (d){ 
            return {
                Group: d.Group
                , Subgroup: d.Subgroup
                , Language: d.Language
                , Speakers: +d.Speakers.replace(/,/g ,"")
                // , nonEnglishSpeakers: +d.nonEnglishSpeakers.replace(/,/g ,"")
            }
        });
        console.log('State Data Loaded');
        const nationalData = await d3.csv('./data/National_Languages.csv', function(d){
            return {
                Group: d.Group,
                Subgroup: d.Subgroup,
                Language: d.Language,
                Speakers: +d.Speakers.replace(/,/g ,""),
                nonEnglishSpeakers: +d.nonEnglishSpeakers.replace(/,/g ,"")
            }
        });
        console.log('National Data Loaded');
        return [stateData, nationalData];
    }
    catch{
        console.log("Data not loaded");
    }
 }

// --------------------------------------------
        // Setup the scales 
// --------------------------------------------

    // Viz #1 - Megacluster scales --------------------------------
    function colorScale(input){
        // Get distinct values, taken from: https://codeburst.io/javascript-array-distinct-5edc93501dc4
        const distinct = (value, index, self) => {
            return self.indexOf(value) === index;
        }
            
        let my_categories = dataset[1].map(x => x.Group).filter(distinct);
    
        // Color scale
        let my_colorScale = d3.scaleOrdinal() 
            .domain(my_categories)
            .range(d3.schemeCategory10.slice(0,5))
        
        return my_colorScale(input)
    }
    
    
    function scaleSize(input){ 
        
        let my_scaleSize = d3.scaleSymlog() 
            .domain([1, 232000000])
            .range([1,20])
            .nice()
        return my_scaleSize(input)
    }
    // ----------------------------------------------------------------

// --------------------------------------------
        // Setup the page 
// --------------------------------------------

    // Setup the page 
    function setup_page(){

        // Create the SVG
        let svg = d3.select("#vis")
            .append('svg')
            .attr('width', 1000)
            .attr('height', 500)
            .attr('opacity', 1)
            .attr('position', 'relative')
        
        // Create the table for Viz #3
        d3.select('#vis')
            .append('div')
                .classed('barchart',true)
            .append('table')
                .attr('id',"table-body")
        
        // Simulation setup
        simulation = d3.forceSimulation(dataset[1])
          .force("center", d3.forceCenter(500,500))
        
        // Define each tick of simulation
       simulation.on('tick', () => {
           nodes
               .attr('cx', d => d.x)
               .attr('cy', d => d.y)
    })
    
        // Viz #1 Megacluster setup
        new cluster(svg)

        // Viz #3 Bar Graph setup
        new Barchart(dataset[0]);

        // Viz #4 Bar Graph setup
        // new BarChart2(dataset[1]);
      
    } // End setup_page function


// --------------------------------------------
        // Control the opacity
// --------------------------------------------    
    function clean(chartType){
        let svg = d3.select('#vis').select('svg')
        if (chartType !== "isFirst"){
            svg.selectAll('circle').transition().attr('opacity',0)
    

        } // End if statement
    } // End function clean()


// --------------------------------------------
        // Draw the visualizations
// --------------------------------------------

    //First Viz
    function draw0(){
        
        //Stop simulation
        simulation.stop()
        
        clean('isFirst') // Turns off opacity for all other charts
        
        let svg = d3.select("#vis")
            .select('svg')
        
        svg.selectAll('circle')
            .transition()
            
            .attr('r',d => scaleSize(d.Speakers))
            .attr('fill',d => colorScale(d.Group))
            .attr('opacity',.8)
    
        simulation.alpha(0.9).restart()
    
    } // end draw0 function

    // Draw 2nd Viz
    function draw1(){
    
    clean('none')
    console.log('Check')
    
    } // end draw1 function    

    function draw2(){
    
        clean('none')
        console.log('Check')
        
    } // end draw1 function   

    function draw3(){

        clean('none')
        console.log('Check')
        
    } // end draw1 function   

// --------------------------------------------
        // Run the scrolling functions
// --------------------------------------------
    let activationFunctions = [
        draw0,
        draw1,
        draw2,
        draw3,
    ]
    
    //All the scrolling function
    //Will draw a new graph based on the index provided by the scroll    
    let scroll = scroller()
        .container(d3.select('#graphic'))
    scroll()
    
    let lastIndex, activeIndex = 0
    
    scroll.on('active', function(index){
        d3.selectAll('.step') // Control opacity of the titles
            .transition().duration(500)
            .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
        
        activeIndex = index
        let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
        let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
        scrolledSections.forEach(i => {
            activationFunctions[i]();
        })
        lastIndex = activeIndex;
    
    })
    
    scroll.on('progress', function(index, progress){
        if (index == 2 & progress > 0.7){
    
        }
    })
      
      
