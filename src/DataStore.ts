import Core from "Bao/Core"
import View from "Bao/View"

class DataStore extends View
{
	obtype = "datastore";

	constructor()
	{
		super();
	}

	set(key, data)
	{
		// do we want to check to see if the data has changed or not?
		this.broadcastDataChanges(key, data);
	}

	setMany(obj)
	{
		for (let key in obj) {
			this.broadcastDataChanges(key, obj[key]);
		}
	}

	broadcastDataChanges(key, data, node?)
	{
		if (!node) node = document.body;
		var child:any = node.firstChild;
		while (child) {
			if (child["stitched"]) {
				let ds = child.getAttribute("data-source");
				if (ds === key) try {
					child.setData(data);
				} catch (e) {}
			}
			this.broadcastDataChanges(key, data, child);
			child = child.nextSibling;
		}
	}

	exclusions()
	{
		return super.exclusions().concat(["broadcastDataChanges","focus"]);
	}
}

export default DataStore;
Core().register("bao/dataStore", DataStore, null);
