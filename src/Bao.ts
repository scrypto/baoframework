import "./Style"
import "./DataStore"
import "./Focus"
import "./Meta"

let $ = (id:string):any => document.getElementById($["prefix"]+id);
$["prefix"] = "";

export default $
