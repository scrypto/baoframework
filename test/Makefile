TOPSRCDIR=..
include $(TOPSRCDIR)/config.mak

.PHONY: all

FILES=Test.ts Imports.ts

all: test.js
	
test.js: $(MODULEDIR)/*/* $(FILES)
	for x in $(FILES); do $(TSC) $$x; done
	$(PACK) Test.js -o tests.js
	$(PACK) Imports.js -o fw.js
	$(MINIFY) fw.js > fw.min.js
	$(PACKER) fw.min.js fw.pack.js

clean:
	rm -rf Test.js tests.js Imports.js fw.js fw.min.js fw.pack.js
