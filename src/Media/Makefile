TOPSRCDIR=../..
include $(TOPSRCDIR)/config.mak

TS_FILES=BaseVideo.ts \
		 Html5Video.ts \
		 HbbTVVideo.ts \
		 Video.ts

JS_FILES=$(TS_FILES:%.ts=$(MODULEDIR)/Bao/Media/%.js)

.PHONY: all lint

all: lint $(JS_FILES)

lint: $(TS_FILES)
	[ `which tslint` ] && tslint -c $(TOPSRCDIR)/tslint.json $(TS_FILES)

$(MODULEDIR)/Bao/Media/%.js: %.ts
	$(TSC) -d --declarationDir $(TOPSRCDIR)/node_modules/Bao/Media/ --outDir $(TOPSRCDIR)/node_modules/Bao/Media/ $<

clean: clean-recursive
	rm -rf $(MODULEDIR)/Bao
