# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
# Python SQL toolkit and Object Relational Mapper
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import random


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

from flask_sqlalchemy import SQLAlchemy


#################################################
# Database Setup
#################################################
engine = create_engine(os.path.join("sqlite:///","DataSets","belly_button_biodiversity.sqlite"),echo=False)


conn = engine.connect()
Base = automap_base()
# Use the Base class to reflect the database tables
Base.prepare(engine, reflect=True)
# Print all of the classes mapped to the Base
Base.classes.keys()
otu_db = Base.classes.otu
samples_db = Base.classes.samples
samples_meta_db = Base.classes.samples_metadata
session = Session(engine)





@app.route("/")
def home():
    
    data=Base.classes.samples.__table__.columns.keys()
    d=data[1:]
    return render_template("index.html",sample_drop=d)


@app.route('/names')
def ret_names():
    samples_cols_list=Base.classes.samples.__table__.columns.keys()
    #remove 1at element otu_id
    return jsonify(samples_cols_list[1:])

@app.route('/otu')
def otu():
    result_taxonomy = session.query(otu_db.lowest_taxonomic_unit_found).all()
    #to create one list of all descriptions
    taxonomy = [i[0] for i in result_taxonomy]
    return jsonify(taxonomy)
    
    


@app.route('/metadata/<sample>')
def metadata_sample(sample):
    sample=str(sample)
    sample=sample.split("_")[1]
    result_sample = session.query(samples_meta_db.AGE,samples_meta_db.BBTYPE,samples_meta_db.ETHNICITY,samples_meta_db.GENDER,samples_meta_db.LOCATION,samples_meta_db.SAMPLEID).filter(samples_meta_db.SAMPLEID==sample).first()
    
    sample_dict={}
    names = ["Age", "BBTYPE", "ETHNICITY","GENDER","LOCATION","SAMPLEID"]
    for i in range(len(names)):
        sample_dict[names[i]]=result_sample[i]
    return jsonify(sample_dict)


@app.route('/wfreq/<sample>')
def wfreq(sample):
    sample=str(sample)
    sample=sample.split("_")[1]
    result_wfreq= session.query(samples_meta_db.WFREQ).filter(samples_meta_db.SAMPLEID==sample).first()

    return jsonify(result_wfreq[0])

@app.route('/samples/<sample>')
def samp_samples(sample):
    sample=str(sample)
    #to dynamically select column, use getattr
    result_samples_desc = session.query(samples_db.otu_id,getattr(samples_db, sample)).order_by(getattr(samples_db, sample).desc()).all()
    
    otu_list=[]
    sample_list=[]
    for i in result_samples_desc:
        otu_list.append(i[0])
        sample_list.append(i[1])
        sample_otu_dict={}
    sample_otu_dict["otu_ids"]=otu_list
    sample_otu_dict["sample_values"]=sample_list
    sample_otu_list=[]
    sample_otu_list.append(sample_otu_dict)
    return jsonify(sample_otu_list)



if __name__ == '__main__':
    app.run(debug=True,port=3316)