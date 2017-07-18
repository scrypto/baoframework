TOPSRCDIR=..
include $(TOPSRCDIR)/config.mak

.PHONY: all

FILES=Test.ts Imports.ts

all: test.js
	
test.js: $(MODULEDIR)/*/* $(FILES)
	for x in $(FILES); do $(TSC) $$x; done
	$(PACK) Test.js -o tests.js
	$(PACK) Imports.js -o bao.js
	$(MINIFY) bao.js > bao.min.js
	$(PACKER) bao.min.js bao.pack.js

clean:
	rm -rf Test.js tests.js Imports.js bao.js bao.min.js bao.pack.js
