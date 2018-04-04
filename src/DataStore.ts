import { $ } from "./Core";
import View from "./View";

class DataStore extends View
{
	obtype = "datastore";

	constructor()
	{
		super();
	}

	$set(key, data)
	{
		// do we want to check to see if the data has changed or not?
		this.$broadcastDataChanges(key, data);
	}

	$setMany(obj)
	{
		Object.keys(obj)
			.forEach((key) => this.$broadcastDataChanges(key, obj[key]));
	}

	$broadcastDataChanges(key, data, node?)
	{
		if (!node) node = document.body;
		[...Array.prototype.slice.call(node.querySelectorAll("[data-source]") as any)].forEach((child) => {
			if (child["stitched"]) {
				const ds = child.getAttribute("data-source");
				try {
					if (ds === key) (child as any as Element & View).$setData(data);
				} catch (e) {
					console.log("broadcastData exception: ", e);
				}
			}
		});
	}

	$exclusions()
	{
		return super.$exclusions().concat(["broadcastDataChanges", "focus"]);
	}
}

export default DataStore;
$.register("bao/dataStore", DataStore, null);
