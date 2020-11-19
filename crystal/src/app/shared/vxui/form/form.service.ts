import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core"

@Injectable()
export class FormService {
    constructor(public translateService:TranslateService) {
        
    }

    generateForm(rawData,isViewMode = false){
        let values = rawData["singledata"]
        let formData = {
            "name": rawData["tablename"], 
            "colNum":3,
            "isViewMode":isViewMode,
            "buttonPosition": "bottom", 
            "buttons":[ {
                "type":"submit",
                "label":this.translateService.instant("Save"),
                "value":"submit"
            }],
            "fields": []
        }
        let refDataSourceType,dataType,fieldData;
        rawData["columns"] = rawData["columns"] || [];
        rawData["columns"].forEach(element => {
            refDataSourceType = element["refdatasourcetype"];
            dataType = element["datatype"];
            fieldData = null;
            if(dataType == "Label"){
                let label = element["name"];
                let styles = "";
                
                if(element["isbold"]){
                    styles+="font-weight:bold;";
                }

                if(element["isitalic"]){
                    styles+="font-style:italic;";
                }

                if(element["isunderline"]){
                    styles+="font-decoration:underline;";

                }

                if(styles.length>0)
                    label = "<span style='"+styles+"'>"+label+"</span>"


                fieldData = {
                    "id": element["code"], 
                    "disabled": false, 
                    "type": "subheader", 
                    "label": label, 
                }
            }
            else if(refDataSourceType == "DirectInput"){
                fieldData = this.makeDirectInput(element);
            }
            else if(refDataSourceType == "RefParameters"){
                fieldData = this.makeRefParameters(element);
            }else if(refDataSourceType == "LookUp"){
                fieldData = this.makeLookup(element);
            }
            if(fieldData){
                let fieldCode = fieldData["id"];
                fieldData["rule"] = element["rule"];
                if(element["fieldlength"]){
                    fieldData["maxLength"] = element["fieldlength"];
                }
                if(element["fieldaccuracy"]){
                    fieldData["precision"] = element["fieldaccuracy"];
                }

                if(values && values[fieldCode]){
                    fieldData["value"] = values[fieldCode];
                }
                else if(values && values[fieldCode]===0){
                    fieldData["value"] = values[fieldCode];
                }else{
                    if(!isViewMode){
                        fieldData["value"] = element["defaultvalue"]
                    }
                    if(fieldData["value"]==""){
                        if(refDataSourceType == "RefParameters"){ //选择
                            fieldData["value"] = "-1"; //默认为情选择
                        }else if(refDataSourceType == "DirectInput" && element["datatype"]=="BIT"){ //bit 是否选择
                            fieldData["value"] = "-1";//默认为情选择
                        }
                    }
                }

                if(isViewMode){
                    let requireConverToText = ["date","datetime","time","year","month","int","float"]
                    if(requireConverToText.indexOf(fieldData["type"])>=0){
                        fieldData["type"] = "text"
                    }
                    if(fieldData["value"]=="-1"){
                        fieldData["value"] = "";
                    }
                }

                if(fieldData)
                    formData["fields"].push(fieldData)
            }
            
        });
        return formData

    }

    makeDirectInput(data){
        let disabled = data.isdisable?data.isdisable:false;
        let allowNull = data.allownull?data.allownull:false;
        let required = !allowNull
        let self = this;
        let generateFactory = {
                "NVARCHAR":function(){
                    return {
                        "id": data["code"], 
                        "disabled": disabled, 
                        "type": "text", 
                        "label": data["name"], 
                        "required": required
                    }
                },
                "INT":function(){
                    return {
                        "id": data["code"], 
                        "disabled": disabled, 
                        "type": "int", 
                        "label": data["name"], 
                        "required": required
                    }
                },
                "FLOAT":function(){
                    return {
                        "id": data["code"], 
                        "disabled": disabled, 
                        "type": "float", 
                        "label": data["name"], 
                        "required": required
                    }
                },
                "MultiLan":function(){
                    return {
                        "id": data["code"], 
                        "disabled": disabled, 
                        "type": "lang", 
                        "label": data["name"], 
                        "required": required
                    }
                },
                "ATTACHMENT":function(){
                    return {
                        "id": data["code"], 
                        "disabled": disabled, 
                        "type": "uploader", 
                        "label": data["name"], 
                        "required": required
                    }
                },
                "MULTILINETEXT":function(){
                    return {
                        "id": data["code"], 
                        "disabled": disabled, 
                        "type": "textarea", 
                        "label": data["name"], 
                        "required": required
                    }
                },
                "DATE":function(){
                    return {
                        "id": data["code"], 
                        "type": "date", 
                        "disabled": disabled, 
                        "label": data["name"], 
                        "required": required
                    }
                },
                "DATETIME":function(){
                    return {
                        "id": data["code"], 
                        "disabled": disabled, 
                        "type": "datetime", 
                        "label": data["name"], 
                        "required": required, 
                    }
                },
                "TIME":function(){
                    return {
                        "id": data["code"], 
                        "disabled": disabled, 
                        "type": "time", 
                        "label": data["name"], 
                        "required": required, 
                    }
                },
                "YEAR":function(){
                    return {
                        "id": data["code"], 
                        "disabled": disabled, 
                        "type": "year", 
                        "label": data["name"], 
                        "required": required, 
                    }
                },
                "MONTH":function(){
                    return {
                        "id": data["code"], 
                        "disabled": disabled, 
                        "type": "month", 
                        "label": data["name"], 
                        "required": required, 
                    }
                },
                "BIT":function(){
                    return {
                        "id": data["code"], 
                        "type": "select", 
                        "disabled": disabled, 
                        "label": data["name"], 
                        "required": required, 
                        "value":"-1",
                        "dataSource": [
                            {
                                "label":self.translateService.instant("Please Choose",{"field":""}),
                                "value":"-1"
                            },
                            {
                                "label": self.translateService.instant("No"), 
                                "value": "0"
                            },
                            {
                                "label": self.translateService.instant("Yes"), 
                                "value": "1"
                            },
                        ]
                    }
                }
        }
        let ret;
        // console.log("widget type:"+data["name"]+","+data["datatype"]);
        let generateMethod = generateFactory[data["datatype"]]
        if(generateMethod){
            ret = generateMethod();
        }
        return ret;
    }


    makeRefParameters(data){
        let disabled = data.isdisable?data.isdisable:false;
        let allowNull = data.allownull?data.allownull:false;
        let required = !allowNull


        data["dropdownitems"] = data["dropdownitems"] || [];
        let ret;
        ret = {
            "id": data["code"], 
            "type": "select", 
            "value":"",
            "disabled": disabled, 
            "label": data["name"], 
            "required": required, 
            "dataSource": [{
                "label":this.translateService.instant("Please Choose",{"field":""}),
                "value":"-1"
            }]
        }
        data["dropdownitems"].forEach((item)=>{
            // if(item["isshow"]=="Y"){
                ret["dataSource"].push({
                    "label": item["datatext"], 
                    "value": item["datavalue"]
                })
            //}
           
        })
        return  ret;
    }
    
    makeLookup(data){
        let disabled = data.isdisable?data.isdisable:false;
        let allowNull = data.allownull?data.allownull:false;
        let required = !allowNull

        let ret;
        ret = {
            "id": data["code"], 
            "type": "positionpicker", 
            "value":"",
            "disabled": disabled, 
            "label": data["name"], 
            "required": required
        }
        
        return  ret;
    }
	
}
