import "bao-framework/Style"
import "bao-framework/DataStore"
import "bao-framework/Focus"
import "bao-framework/Meta"

let $ = (id:string):any => document.getElementById($["prefix"]+id);
$["prefix"] = "";

export default $
