import type { Data } from 'csl-json';
import * as astrocite from 'astrocite-bibtex';
import {CSL} from "./vendor/citeproc_commonjs.js"
/* *********************** *
 * Bibliographic Referenes *
 * *********************** */
type ReferenceItem = Data;

async function fetchReferences(url:string):Promise<ReferenceItem[]> {
	const result = await fetch(url);
	const text = await result.text();
	return astrocite.parse(text);
}


/* ************** *
* CITATIONS DATA *
* ************** */
type CitationItem = {
	/*see: https://citeproc-js.readthedocs.io/en/latest/csl-json/markup.html*/
	"id":string;
	"locator"?: string | number;
	"label"?: string;
	"prefix"?: string;
	"suffix"?: string;
	"suppress-author"?:boolean;
	"author-only"?:boolean;
	"position"?:number;
	"near-note"?: boolean;
}

type Citation = {
	/*see: https://citeproc-js.readthedocs.io/en/latest/csl-json/markup.html*/
	citationItems: CitationItem[];
	properties: any;
}

function parsePandocToCitation(mention:string){
    return {
        citationItems:[{
            "id": mention.slice(1),
            "locator": 123,
            "label": "page",
            "prefix": "See ",
            "suffix": " (arguing that X is Y)"
        }],
        properties: {
            noteIndex: 1
        }
    }
};

/* ==================== */
var styleID = "apa";

async function fetchCSL(styleID:string) {
	const response = await fetch(`https://raw.githubusercontent.com/citation-style-language/styles/master/${styleID}.csl`);
	const csl = await response.text();
	return csl;
}

const style = await fetchCSL(styleID);
console.assert(style?true:false);

// Initialize a system object, which contains two methods needed by the
// engine.
var xhr = new XMLHttpRequest();


// Given the identifier of a CSL style, this function instantiates a CSL.Engine
// object that can render citations in that style.

function getProcessor(references: ReferenceItem[]) {
	// Instantiate and return the engine
	var citeproc = new CSL.Engine({
		retrieveLocale: function (lang:string) {
			xhr.open('GET', `https://raw.githubusercontent.com/Juris-M/citeproc-js-docs/master/locales-${lang}.xml`, false);
			xhr.send(null);
			return xhr.responseText;
		},
		retrieveItem: function(id:string) {
			const itemIdx = references.findIndex((item)=>item.id==id)
			return references[itemIdx];
		}
	}, style);
	return citeproc;
};

type FormattingParameters = {
	maxoffset: number;
	entryspacing: number;
	linespacing: number;
	hangingindent: boolean;
	"second-field-align": boolean;
	bibstart: string;
	bibend: string;
	bibliography_errors: any[];
	entry_ids: string[];
}

type Bibliography = [
	FormattingParameters,
	string[]
];


// function getCiteCluster(source:string, references:ReferenceItem[]){
// 	var citeproc = getProcessor(references);
// 	var citationsPre = [ ["adolph.etal_2014", 1] ];
// 	var citationsPost = [ ["adolph.etal_2014", 1] ];
// 	var result = citeproc.processCitationCluster(citations[0], [], []);
// }

function getBibliography(references:ReferenceItem[]) {
	var citeproc = getProcessor(references);
	// var citationsPre = [ ["adolph.etal_2014", 1] ];
	// var citationsPost = [ ["adolph.etal_2014", 1] ];
	// var result = citeproc.processCitationCluster(citations[0], [], []);
	citeproc.updateItems(references.map(ref=>ref.id));
	const bibliography:Bibliography = citeproc.makeBibliography();
	return bibliography;
}

export type {ReferenceItem, 
            Citation, 
            CitationItem, 
            Bibliography, 
            FormattingParameters};
export {fetchReferences, getBibliography};

async function example(){
    const references:ReferenceItem[] = await fetchReferences("./ref.bib");
    console.log("references:", references);
    const bibliography = getBibliography(references);
    console.log("bibliography:", bibliography);
}
export {example};