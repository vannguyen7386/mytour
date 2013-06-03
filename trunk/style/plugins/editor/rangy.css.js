/**
 * CSS Class Applier module for Rangy.
 * Adds, removes and toggles CSS classes on Ranges and Selections
 *
 * Part of Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Depends on Rangy core.
 *
 * Copyright 2012, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3alpha.681
 * Build date: 20 July 2012
 */
rangy.createModule("CssClassApplier",function(a,b){
    function f(a){
        return a.replace(/^\s\s*/,"").replace(/\s\s*$/,"")
        }
        function g(a,b){
        return a.className&&(new RegExp("(?:^|\\s)"+b+"(?:\\s|$)")).test(a.className)
        }
        function h(a,b){
        a.className?g(a,b)||(a.className+=" "+b):a.className=b
        }
        function j(a){
        return a.split(/\s+/).sort().join(" ")
        }
        function k(a){
        return j(a.className)
        }
        function l(a,b){
        return k(a)==k(b)
        }
        function m(a,b){
        return a.compareBoundaryPoints(b.START_TO_START,b)
        }
        function n(a){
        for(var b=0,c=a.length,d,e,f;b<c;++b);
    }
    function o(a){
        var b=a.slice(0);
        b.sort(m);
        var c=[];
        for(var d=1,e=a.length,f,g=a[0];d<e;++d)f=a[d],f.intersectsOrTouchesRange(g)?g=g.union(f):(c.push(g),g=f);
        return c.push(g),c
        }
        function p(a,b,c,d,e){
        var f=a.node,g=a.offset,h=f,i=g;
        f==d&&g>e&&i++,f==b&&(g==c||g==c+1)&&(h=d,i+=e-c),f==b&&g>c+1&&i--,a.node=h,a.offset=i
        }
        function q(a,b,d,e){
        d==-1&&(d=b.childNodes.length);
        var f=a.parentNode,g=c.getNodeIndex(a);
        for(var h=0,i;i=e[h++];)p(i,f,g,b,d);
        b.childNodes.length==d?b.appendChild(a):b.insertBefore(a,b.childNodes[d])
        }
        function r(a,b,c,d,e){
        var f,g=[];
        while(f=a.firstChild)q(f,b,c++,e),g.push(f);
        return d&&a.parentNode.removeChild(a),g
        }
        function s(a,b){
        return r(a,a.parentNode,c.getNodeIndex(a),!0,b)
        }
        function t(a,b){
        var c=a.cloneRange();
        c.selectNodeContents(b);
        var d=c.intersection(a),e=d?d.toString():"";
        return c.detach(),e!=""
        }
        function u(a){
        return a.getNodes([3],function(b){
            return t(a,b)
            })
        }
        function v(a,b){
        if(a.attributes.length!=b.attributes.length)return!1;
        for(var c=0,d=a.attributes.length,e,f,g;c<d;++c){
            e=a.attributes[c],g=e.name;
            if(g!="class"){
                f=b.attributes.getNamedItem(g);
                if(e.specified!=f.specified)return!1;
                if(e.specified&&e.nodeValue!==f.nodeValue)return!1
                    }
                }
        return!0
    }
    function w(a,b){
    for(var d=0,e=a.attributes.length,f;d<e;++d){
        f=a.attributes[d].name;
        if((!b||!c.arrayContains(b,f))&&a.attributes[d].specified&&f!="class")return!0
            }
            return!1
    }
    function x(a,b){
    var c;
    for(var d in b)if(b.hasOwnProperty(d)){
        c=b[d];
        if(typeof c=="object"){
            if(!x(a[d],c))return!1
                }else if(a[d]!==c)return!1
            }
            return!0
    }
    function A(a){
    var b;
    return a&&a.nodeType==1&&((b=a.parentNode)&&b.nodeType==9&&b.designMode=="on"||z(a)&&!z(a.parentNode))
    }
    function B(a){
    return(z(a)||a.nodeType!=1&&z(a.parentNode))&&!A(a)
    }
    function D(a){
    return a&&a.nodeType==1&&!C.test(y(a,"display"))
    }
    function F(a){
    if(a.data.length==0)return!0;
    if(E.test(a.data))return!1;
    var b=y(a.parentNode,"whiteSpace");
    switch(b){
        case"pre":case"pre-wrap":case"-moz-pre-wrap":
            return!1;
        case"pre-line":
            if(/[\r\n]/.test(a.data))return!1
            }
            return D(a.previousSibling)||D(a.nextSibling)
    }
    function G(a){
    var b=[],c,e;
    for(c=0;e=a[c++];)b.push(new d(e.startContainer,e.startOffset),new d(e.endContainer,e.endOffset));
    return b
    }
    function H(a,b){
    for(var c=0,d,e,f,g=a.length;c<g;++c)d=a[c],e=b[c*2],f=b[c*2+1],d.setStartAndEnd(e.node,e.offset,f.node,f.offset)
        }
        function I(a,b){
    var c=[];
    for(var d=0,e=a.length;d<e;++d)a[d]!==b&&c.push(a[d]);
    return c
    }
    function J(a,b){
    return c.isCharacterDataNode(a)?b==0?!!a.previousSibling:b==a.length?!!a.nextSibling:!0:b>0&&b<a.childNodes.length
    }
    function K(a,d,e,f){
    var g,h,i=e==0;
    if(c.isAncestorOf(d,a))return a;
    if(c.isCharacterDataNode(d)){
        var j=c.getNodeIndex(d);
        if(e==0)e=j;
        else{
            if(e!=d.length)throw b.createError("splitNodeAt() should not be called with offset in the middle of a data node ("+e+" in "+d.data);
            e=j+1
            }
            d=d.parentNode
        }
        if(J(d,e)){
        g=d.cloneNode(!1),h=d.parentNode,g.id&&g.removeAttribute("id");
        var k,l=0;
        while(k=d.childNodes[e])q(k,g,l++,f);
        return q(g,h,c.getNodeIndex(d)+1,f),d==a?g:K(a,h,c.getNodeIndex(g),f)
        }
        if(a!=d){
        g=d.parentNode;
        var m=c.getNodeIndex(d);
        return i||m++,K(a,g,m,f)
        }
        return a
    }
    function L(a,b){
    return a.tagName==b.tagName&&l(a,b)&&v(a,b)&&y(a,"display")=="inline"&&y(b,"display")=="inline"
    }
    function M(a){
    var b=a?"nextSibling":"previousSibling";
    return function(c,d){
        var e=c.parentNode,f=c[b];
        if(f){
            if(f&&f.nodeType==3)return f
                }else if(d){
            f=e[b];
            if(f&&f.nodeType==1&&L(e,f))return f[a?"firstChild":"lastChild"]
                }
                return null
        }
    }
function P(a){
    this.isElementMerge=a.nodeType==1,this.firstTextNode=this.isElementMerge?a.lastChild:a,this.textNodes=[this.firstTextNode]
    }
    function S(a,b,c){
    this.cssClass=a;
    var d,e,g,h,i=null;
    if(typeof b=="object"&&b!==null){
        c=b.tagNames,i=b.elementProperties;
        for(e=0;h=Q[e++];)b.hasOwnProperty(h)&&(this[h]=b[h]);
        d=b.normalize
        }else d=b;
    this.normalize=typeof d=="undefined"?!0:d,this.attrExceptions=[];
    var j=document.createElement(this.elementTagName);
    this.elementProperties=this.copyPropertiesToElement(i,j,!0),this.elementSortedClassName=this.elementProperties.hasOwnProperty("className")?this.elementProperties.className:a,this.applyToAnyTagName=!1;
    var k=typeof c;
    if(k=="string")c=="*"?this.applyToAnyTagName=!0:this.tagNames=f(c.toLowerCase()).split(/\s*,\s*/);
    else if(k=="object"&&typeof c.length=="number"){
        this.tagNames=[];
        for(e=0,g=c.length;e<g;++e)c[e]=="*"?this.applyToAnyTagName=!0:this.tagNames.push(c[e].toLowerCase())
            }else this.tagNames=[this.elementTagName]
        }
        function T(a,b,c){
    return new S(a,b,c)
    }
    a.requireModules(["WrappedSelection","WrappedRange"]);
    var c=a.dom,d=c.DomPosition,e="span",i=function(){
    function a(a,b,c){
        return b&&c?" ":""
        }
        return function(b,c){
        b.className&&(b.className=b.className.replace(new RegExp("(^|\\s)"+c+"(\\s|$)"),a))
        }
    }(),y;
typeof window.getComputedStyle!="undefined"?y=function(a,b){
    return c.getWindow(a).getComputedStyle(a,null)[b]
    }:typeof document.documentElement.currentStyle!="undefined"?y=function(a,b){
    return a.currentStyle[b]
    }:b.fail("No means of obtaining computed style properties found");
var z;
(function(){
    var a=document.createElement("div");
    typeof a.isContentEditable=="boolean"?z=function(a){
        return a&&a.nodeType==1&&a.isContentEditable
        }:z=function(a){
        return!a||a.nodeType!=1||a.contentEditable=="false"?!1:a.contentEditable=="true"||z(a.parentNode)
        }
    })();
var C=/^inline(-block|-table)?$/i,E=/[^\r\n\t\f \u200B]/,N=M(!1),O=M(!0);
P.prototype={
    doMerge:function(a){
        var b=[],c=0,d,e,f;
        for(var g=0,h=this.textNodes.length,i,j;g<h;++g){
            d=this.textNodes[g],e=d.parentNode;
            if(g>0){
                e.removeChild(d),e.hasChildNodes()||e.parentNode.removeChild(e);
                if(a)for(i=0;j=a[i++];)j.node==d&&(j.node=this.firstTextNode,j.offset+=c)
                    }
                    b[g]=d.data,c+=d.data.length
            }
            return this.firstTextNode.data=f=b.join(""),f
        },
    getLength:function(){
        var a=this.textNodes.length,b=0;
        while(a--)b+=this.textNodes[a].length;
        return b
        },
    toString:function(){
        var a=[];
        for(var b=0,c=this.textNodes.length;b<c;++b)a[b]="'"+this.textNodes[b].data+"'";
        return"[Merge("+a.join(",")+")]"
        }
    };

var Q=["elementTagName","ignoreWhiteSpace","applyToEditableOnly","useExistingElements"],R={};

S.prototype={
    elementTagName:e,
    elementProperties:{},
    ignoreWhiteSpace:!0,
    applyToEditableOnly:!1,
    useExistingElements:!0,
    copyPropertiesToElement:function(a,b,c){
        var d,e,f={},g,i,k,l;
        for(var m in a)if(a.hasOwnProperty(m)){
            i=a[m],k=b[m];
            if(m=="className")h(b,i),h(b,this.cssClass),b[m]=j(b[m]),c&&(f[m]=b[m]);
            else if(m=="style"){
                e=k,c&&(f[m]=g={});
                for(d in a[m])e[d]=i[d],c&&(g[d]=e[d]);this.attrExceptions.push(m)
                }else b[m]=i,c&&(f[m]=b[m],l=R.hasOwnProperty(m)?R[m]:m,this.attrExceptions.push(l))
                }
                return c?f:""
        },
    hasClass:function(a){
        return a.nodeType==1&&c.arrayContains(this.tagNames,a.tagName.toLowerCase())&&g(a,this.cssClass)
        },
    getSelfOrAncestorWithClass:function(a){
        while(a){
            if(this.hasClass(a))return a;
            a=a.parentNode
            }
            return null
        },
    isModifiable:function(a){
        return!this.applyToEditableOnly||B(a)
        },
    isIgnorableWhiteSpaceNode:function(a){
        return this.ignoreWhiteSpace&&a&&a.nodeType==3&&F(a)
        },
    postApply:function(a,b,c,d){
        var e=a[0],f=a[a.length-1],g=[],h,i=e,j=f,k=0,l=f.length,m,n;
        for(var o=0,p=a.length;o<p;++o)m=a[o],n=N(m,!d),n?(h||(h=new P(n),g.push(h)),h.textNodes.push(m),m===e&&(i=h.firstTextNode,k=i.length),m===f&&(j=h.firstTextNode,l=h.getLength())):h=null;
        var q=O(f,!d);
        q&&(h||(h=new P(f),g.push(h)),h.textNodes.push(q));
        if(g.length){
            for(o=0,p=g.length;o<p;++o)g[o].doMerge(c);
            b.setStartAndEnd(i,k,j,l)
            }
        },
createContainer:function(a){
    var b=a.createElement(this.elementTagName);
    return this.copyPropertiesToElement(this.elementProperties,b,!1),h(b,this.cssClass),b
    },
applyToTextNode:function(a,b){
    var d=a.parentNode;
    if(d.childNodes.length==1&&c.arrayContains(this.tagNames,d.tagName.toLowerCase())&&this.useExistingElements)h(d,this.cssClass);
    else{
        var e=this.createContainer(c.getDocument(a));
        a.parentNode.insertBefore(e,a),e.appendChild(a)
        }
    },
isRemovable:function(a){
    return a.tagName.toLowerCase()==this.elementTagName&&k(a)==this.elementSortedClassName&&x(a,this.elementProperties)&&!w(a,this.attrExceptions)&&this.isModifiable(a)
    },
undoToTextNode:function(a,b,c,d){
    if(!b.containsNode(c)){
        var e=b.cloneRange();
        e.selectNode(c),e.isPointInRange(b.endContainer,b.endOffset)&&(K(c,b.endContainer,b.endOffset,d),b.setEndAfter(c)),e.isPointInRange(b.startContainer,b.startOffset)&&(c=K(c,b.startContainer,b.startOffset,d))
        }
        this.isRemovable(c)?s(c,d):i(c,this.cssClass)
    },
applyToRange:function(a,b){
    b=b||[];
    var c=G(b||[]);
    a.splitBoundariesPreservingPositions(c);
    var d=u(a);
    if(d.length){
        for(var e=0,f;f=d[e++];)!this.isIgnorableWhiteSpaceNode(f)&&!this.getSelfOrAncestorWithClass(f)&&this.isModifiable(f)&&this.applyToTextNode(f,c);
        a.setStart(d[0],0),f=d[d.length-1],a.setEnd(f,f.length),this.normalize&&this.postApply(d,a,c,!1),H(b,c)
        }
    },
applyToRanges:function(a){
    var b=a.length;
    while(b--)this.applyToRange(a[b],a);
    return a
    },
applyToSelection:function(b){
    var c=a.getSelection(b);
    c.setRanges(this.applyToRanges(c.getAllRanges()))
    },
undoToRange:function(a,b){
    b=b||[];
    var c=G(b);
    a.splitBoundariesPreservingPositions(c);
    var d=u(a),e,f,g=d[d.length-1];
    if(d.length){
        for(var h=0,i=d.length;h<i;++h)e=d[h],f=this.getSelfOrAncestorWithClass(e),f&&this.isModifiable(e)&&this.undoToTextNode(e,a,f,c),a.setStart(d[0],0),a.setEnd(g,g.length);
        this.normalize&&this.postApply(d,a,c,!0),H(b,c)
        }
    },
undoToRanges:function(a){
    var b=a.length;
    while(b--)this.undoToRange(a[b],a);
    return a.forEach(function(a){}),a
    },
undoToSelection:function(b){
    var c=a.getSelection(b),d=a.getSelection(b).getAllRanges();
    this.undoToRanges(d),c.setRanges(d)
    },
getTextSelectedByRange:function(a,b){
    var c=b.cloneRange();
    c.selectNodeContents(a);
    var d=c.intersection(b),e=d?d.toString():"";
    return c.detach(),e
    },
isAppliedToRange:function(a){
    if(a.collapsed)return!!this.getSelfOrAncestorWithClass(a.commonAncestorContainer);
    var b=a.getNodes([3]);
    for(var c=0,d;d=b[c++];)if(!this.isIgnorableWhiteSpaceNode(d)&&t(a,d)&&this.isModifiable(d)&&!this.getSelfOrAncestorWithClass(d))return!1;return!0
    },
isAppliedToRanges:function(a){
    var b=a.length;
    while(b--)if(!this.isAppliedToRange(a[b]))return!1;
    return!0
    },
isAppliedToSelection:function(b){
    var c=a.getSelection(b);
    return this.isAppliedToRanges(c.getAllRanges())
    },
toggleRange:function(a){
    this.isAppliedToRange(a)?this.undoToRange(a):this.applyToRange(a)
    },
toggleRanges:function(a){
    this.isAppliedToRanges(a)?this.undoToRanges(a):this.applyToRanges(a)
    },
toggleSelection:function(a){
    this.isAppliedToSelection(a)?this.undoToSelection(a):this.applyToSelection(a)
    },
detach:function(){}
},S.util={
    hasClass:g,
    addClass:h,
    removeClass:i,
    hasSameClasses:l,
    replaceWithOwnChildren:s,
    elementsHaveSameNonClassAttributes:v,
    elementHasNonClassAttributes:w,
    splitNodeAt:K,
    isEditableElement:z,
    isEditingHost:A,
    isEditable:B
},a.CssClassApplier=S,a.createCssClassApplier=T
})