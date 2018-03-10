Belly Button Biodiversity

https://belly-button-bio.herokuapp.com/

The belly button is one of the habitats closest to us, and yet it remains relatively unexplored. In January 2011, http://robdunnlab.com launched Belly Button Biodiversity to investigate the microbes inhabiting our navels and the factors that might influence the microscopic life calling this protected, moist patch of skin home. In addition to inspiring scientific curiosity, Belly Button Biodiversity inspired conversations about the beneficial roles microbes play in our daily lives.



This following project combines the power of Python with Javascript, CSS and HTML, to explore the patterns and species found in the bellybutton, using the data in sqlite file. Using the interactive Plotly library , datas were visualized. Finally the app is deployed on Heroku and can be accessed at :  https://belly-button-bio.herokuapp.com/ .



Step 1 - Flask API

Flask is used to design an API for the  dataset and to serve the HTML and JavaScript required for the dashboard page. Using the sqlite database file and SQLAlchemy with Flask application code,  routes below are created.

- First,  a template called index.html was created for dashboard landing page. 
- Next, create the following routes for  api.

    @app.route("/")
        """Return the dashboard homepage."""

    @app.route('/names')
        """List of sample names.
    
        Returns a list of sample names in the format
        [
            "BB_940",
            "BB_941",
            "BB_943",
            "BB_944",
            "BB_945",
            "BB_946",
            "BB_947",
            ...
        ]
    
        """

    @app.route('/otu')
        """List of OTU descriptions.
    
        Returns a list of OTU descriptions in the following format
    
        [
            "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
            "Archaea;Euryarchaeota;Halobacteria;Halobacteriales;Halobacteriaceae;Halococcus",
            "Bacteria",
            "Bacteria",
            "Bacteria",
            ...
        ]
        """

    @app.route('/metadata/<sample>')
        """MetaData for a given sample.
    
        Args: Sample in the format: `BB_940`
    
        Returns a json dictionary of sample metadata in the format
    
        {
            AGE: 24,
            BBTYPE: "I",
            ETHNICITY: "Caucasian",
            GENDER: "F",
            LOCATION: "Beaufort/NC",
            SAMPLEID: 940
        }
        """

    @app.route('/wfreq/<sample>')
        """Weekly Washing Frequency as a number.
    
        Args: Sample in the format: `BB_940`
    
        Returns an integer value for the weekly washing frequency `WFREQ`
        """

    @app.route('/samples/<sample>')
        """OTU IDs and Sample Values for a given sample.
    
        Sort your Pandas DataFrame (OTU ID and Sample Value)
        in Descending Order by Sample Value
    
        Return a list of dictionaries containing sorted lists  for `otu_ids`
        and `sample_values`
    
        [
            {
                otu_ids: [
                    1166,
                    2858,
                    481,
                    ...
                ],
                sample_values: [
                    163,
                    126,
                    113,
                    ...
                ]
            }
        ]
        """

---

Step 2 - Plotly.js

The interactive Plotly libray was used for visualization purposes. Using app.js , the following charts were drawn and displayed. 

- The route /names  : to populate a dropdown select element with the list of sample names.
- PIE chart :  Uses data from  routes /samples/<sample> and /otu to display the top 10 samples.
- Bubble Chart : Uses data from  routes /samples/<sample> and /otu to plot the Sample Value vs the OTU ID for the selected sample.
- Sample Metadata: Primary info panel that displays metadata information  from the route /metadata/<sample>
- Gauge Chart: Plots Weekly Washing Frequency obtained from the route /wfreq/<sample>
  

---


