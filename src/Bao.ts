import "Bao/Style"
import "Bao/DataStore"
import "Bao/Focus"
import "Bao/Meta"

let $ = (id:string):any => document.getElementById($["prefix"]+id);
$["prefix"] = "";

export default $
