/**
 * Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Copyright 2012, Tim Down
 * Licensed under the MIT license.
 * Version: 1.3alpha.681
 * Build date: 20 July 2012
 */
window.rangy=function(){
    function h(c,d){
        var e=typeof c[d];
        return e==b||e==a&&!!c[d]||e=="unknown"
        }
        function i(b,c){
        return typeof b[c]==a&&!!b[c]
        }
        function j(a,b){
        return typeof a[b]!=c
        }
        function k(a){
        return function(b,c){
            var d=c.length;
            while(d--)if(!a(b,c[d]))return!1;
            return!0
            }
        }
    function o(a){
    return a&&l(a,g)&&n(a,f)
    }
    function q(a,b){
    b?window.alert(a):typeof window.console!=c&&typeof window.console.log!=c&&window.console.log(a)
    }
    function r(a){
    p.initialized=!0,p.supported=!1,q("Rangy is not supported on this page in your browser. Reason: "+a,p.config.alertOnFail)
    }
    function s(a){
    q("Rangy warning: "+a,p.config.alertOnWarn)
    }
    function v(){
    if(p.initialized)return;
    var a,b=!1,c=!1;
    h(document,"createRange")&&(a=document.createRange(),l(a,e)&&n(a,d)&&(b=!0),a.detach());
    var f=i(document,"body")?document.body:document.getElementsByTagName("body")[0];
    if(!f||f.nodeName.toLowerCase()!="body"){
        r("No body element found");
        return
    }
    f&&h(f,"createTextRange")&&(a=f.createTextRange(),o(a)&&(c=!0));
    if(!b&&!c){
        r("Neither Range nor TextRange are available");
        return
    }
    p.initialized=!0,p.features={
        implementsDomRange:b,
        implementsTextRange:c
    };

    var g=u.concat(t);
    for(var j=0,k=g.length;j<k;++j)try{
        g[j](p)
        }catch(m){
        i(window,"console")&&h(window.console,"log")&&window.console.log("Rangy init listener threw an exception. Continuing.",m)
        }
    }
    function x(a){
    a=a||window,v();
    for(var b=0,c=w.length;b<c;++b)w[b](a)
        }
        function y(a){
    this.name=a,this.initialized=!1,this.supported=!1
    }
    var a="object",b="function",c="undefined",d=["startContainer","startOffset","endContainer","endOffset","collapsed","commonAncestorContainer"],e=["setStart","setStartBefore","setStartAfter","setEnd","setEndBefore","setEndAfter","collapse","selectNode","selectNodeContents","compareBoundaryPoints","deleteContents","extractContents","cloneContents","insertNode","surroundContents","cloneRange","toString","detach"],f=["boundingHeight","boundingLeft","boundingTop","boundingWidth","htmlText","text"],g=["collapse","compareEndPoints","duplicate","moveToElementText","parentElement","select","setEndPoint","getBoundingClientRect"],l=k(h),m=k(i),n=k(j),p={
    version:"1.3alpha.681",
    initialized:!1,
    supported:!0,
    util:{
        isHostMethod:h,
        isHostObject:i,
        isHostProperty:j,
        areHostMethods:l,
        areHostObjects:m,
        areHostProperties:n,
        isTextRange:o
    },
    features:{},
    modules:{},
    config:{
        alertOnFail:!0,
        alertOnWarn:!1,
        preferTextRange:!1
        }
    };

p.fail=r,p.warn=s,{}.hasOwnProperty?p.util.extend=function(a,b,c){
    var d,e;
    for(var f in b)b.hasOwnProperty(f)&&(d=a[f],e=b[f],c&&d!==null&&typeof d=="object"&&e!==null&&typeof e=="object"&&p.util.extend(d,e,!0),a[f]=e);return a
    }:r("hasOwnProperty not supported");
var t=[],u=[];
p.init=v,p.addInitListener=function(a){
    p.initialized?a(p):t.push(a)
    };

var w=[];
p.addCreateMissingNativeApiListener=function(a){
    w.push(a)
    },p.createMissingNativeApi=x,y.prototype={
    fail:function(a){
        throw this.initialized=!0,this.supported=!1,new Error("Module '"+this.name+"' failed to load: "+a)
        },
    warn:function(a){
        p.warn("Module "+this.name+": "+a)
        },
    deprecationNotice:function(a,b){
        p.warn("DEPRECATED: "+a+" in module "+this.name+"is deprecated. Please use "+b+" instead")
        },
    createError:function(a){
        return new Error("Error in Rangy "+this.name+" module: "+a)
        }
    },p.createModule=function(a,b){
    var c=new y(a);
    p.modules[a]=c,u.push(function(a){
        b(a,c),c.initialized=!0,c.supported=!0
        })
    },p.requireModules=function(a){
    for(var b=0,c=a.length,d,e;b<c;++b){
        e=a[b],d=p.modules[e];
        if(!d||!(d instanceof y))throw new Error("Module '"+e+"' not found");
        if(!d.supported)throw new Error("Module '"+e+"' not supported")
            }
        };

var z=!1,A=function(a){
    z||(z=!0,p.initialized||v())
    };

if(typeof window==c){
    r("No window found");
    return
}
if(typeof document==c){
    r("No document found");
    return
}
return h(document,"addEventListener")&&document.addEventListener("DOMContentLoaded",A,!1),h(window,"addEventListener")?window.addEventListener("load",A,!1):h(window,"attachEvent")?window.attachEvent("onload",A):r("Window does not have required addEventListener or attachEvent method"),p
}(),rangy.createModule("DomUtil",function(a,b){
    function h(a){
        var b;
        return typeof a.namespaceURI==c||(b=a.namespaceURI)===null||b=="http://www.w3.org/1999/xhtml"
        }
        function i(a){
        var b=a.parentNode;
        return b.nodeType==1?b:null
        }
        function j(a){
        var b=0;
        while(a=a.previousSibling)b++;
        return b
        }
        function k(a){
        switch(a.nodeType){
            case 7:case 10:
                return 0;
            case 3:case 8:
                return a.length;
            default:
                return a.childNodes.length
                }
            }
    function l(a,b){
    var c=[],d;
    for(d=a;d;d=d.parentNode)c.push(d);
    for(d=b;d;d=d.parentNode)if(g(c,d))return d;return null
    }
    function m(a,b,c){
    var d=c?b:b.parentNode;
    while(d){
        if(d===a)return!0;
        d=d.parentNode
        }
        return!1
    }
    function n(a,b){
    return m(a,b,!0)
    }
    function o(a,b,c){
    var d,e=c?a:a.parentNode;
    while(e){
        d=e.parentNode;
        if(d===b)return e;
        e=d
        }
        return null
    }
    function p(a){
    var b=a.nodeType;
    return b==3||b==4||b==8
    }
    function q(a){
    if(!a)return!1;
    var b=a.nodeType;
    return b==3||b==8
    }
    function r(a,b){
    var c=b.nextSibling,d=b.parentNode;
    return c?d.insertBefore(a,c):d.appendChild(a),a
    }
    function s(a,b,c){
    var d=a.cloneNode(!1);
    d.deleteData(0,b),a.deleteData(b,a.length-b),r(d,a);
    if(c)for(var e=0,f;f=c[e++];)f.node==a&&f.offset>b?(f.node=d,f.offset-=b):f.node==a.parentNode&&f.offset>j(a)&&++f.offset;
    return d
    }
    function t(a){
    if(a.nodeType==9)return a;
    if(typeof a.ownerDocument!=c)return a.ownerDocument;
    if(typeof a.document!=c)return a.document;
    if(a.parentNode)return t(a.parentNode);
    throw b.createError("getDocument: no document found for node")
    }
    function u(a){
    var d=t(a);
    if(typeof d.defaultView!=c)return d.defaultView;
    if(typeof d.parentWindow!=c)return d.parentWindow;
    throw b.createError("Cannot get a window object for node")
    }
    function v(a){
    if(typeof a.contentDocument!=c)return a.contentDocument;
    if(typeof a.contentWindow!=c)return a.contentWindow.document;
    throw b.createError("getIframeDocument: No Document object found for iframe element")
    }
    function w(a){
    if(typeof a.contentWindow!=c)return a.contentWindow;
    if(typeof a.contentDocument!=c)return a.contentDocument.defaultView;
    throw b.createError("getIframeWindow: No Window object found for iframe element")
    }
    function x(a){
    return d.isHostObject(a,"body")?a.body:a.getElementsByTagName("body")[0]
    }
    function y(a){
    return a&&d.isHostMethod(a,"setTimeout")&&d.isHostObject(a,"document")
    }
    function z(a){
    var b;
    return a?d.isHostProperty(a,"nodeType")?b=a.nodeType==1&&a.tagName.toLowerCase()=="iframe"?v(a):t(a):y(a)&&(b=a.document):b=document,b
    }
    function A(a){
    var b;
    while(b=a.parentNode)a=b;
    return a
    }
    function B(a,c,d,e){
    var f,g,h,i,k;
    if(a==d)return c===e?0:c<e?-1:1;
    if(f=o(d,a,!0))return c<=j(f)?-1:1;
    if(f=o(a,d,!0))return j(f)<e?-1:1;
    g=l(a,d),h=a===g?g:o(a,g,!0),i=d===g?g:o(d,g,!0);
    if(h===i)throw b.createError("comparePoints got to case 4 and childA and childB are the same!");
    k=g.firstChild;
    while(k){
        if(k===h)return-1;
        if(k===i)return 1;
        k=k.nextSibling
        }
    }
function C(a){
    if(!a)return"[No node]";
    if(p(a))return'"'+a.data+'"';
    if(a.nodeType==1){
        var b=a.id?' id="'+a.id+'"':"";
        return"<"+a.nodeName+b+">["+a.childNodes.length+"]"
        }
        return a.nodeName
    }
    function D(a){
    var b=t(a).createDocumentFragment(),c;
    while(c=a.firstChild)b.appendChild(c);
    return b
    }
    function E(a){
    this.root=a,this._next=a
    }
    function F(a){
    return new E(a)
    }
    function G(a,b){
    this.node=a,this.offset=b
    }
    function H(a){
    this.code=this[a],this.codeName=a,this.message="DOMException: "+this.codeName
    }
    var c="undefined",d=a.util;
d.areHostMethods(document,["createDocumentFragment","createElement","createTextNode"])||b.fail("document missing a Node creation method"),d.isHostMethod(document,"getElementsByTagName")||b.fail("document missing getElementsByTagName method");
var e=document.createElement("div");
d.areHostMethods(e,["insertBefore","appendChild","cloneNode"]||!d.areHostObjects(e,["previousSibling","nextSibling","childNodes","parentNode"]))||b.fail("Incomplete Element implementation"),d.isHostProperty(e,"innerHTML")||b.fail("Element is missing innerHTML property");
var f=document.createTextNode("test");
d.areHostMethods(f,["splitText","deleteData","insertData","appendData","cloneNode"]||!d.areHostObjects(e,["previousSibling","nextSibling","childNodes","parentNode"])||!d.areHostProperties(f,["data"]))||b.fail("Incomplete Text Node implementation");
var g=function(a,b){
    var c=a.length;
    while(c--)if(a[c]===b)return!0;
    return!1
    };

E.prototype={
    _current:null,
    hasNext:function(){
        return!!this._next
        },
    next:function(){
        var a=this._current=this._next,b,c;
        if(this._current){
            b=a.firstChild;
            if(b)this._next=b;
            else{
                c=null;
                while(a!==this.root&&!(c=a.nextSibling))a=a.parentNode;
                this._next=c
                }
            }
        return this._current
    },
detach:function(){
    this._current=this._next=this.root=null
    }
},G.prototype={
    equals:function(a){
        return!!a&&this.node===a.node&&this.offset==a.offset
        },
    inspect:function(){
        return"[DomPosition("+C(this.node)+":"+this.offset+")]"
        },
    toString:function(){
        return this.inspect()
        }
    },H.prototype={
    INDEX_SIZE_ERR:1,
    HIERARCHY_REQUEST_ERR:3,
    WRONG_DOCUMENT_ERR:4,
    NO_MODIFICATION_ALLOWED_ERR:7,
    NOT_FOUND_ERR:8,
    NOT_SUPPORTED_ERR:9,
    INVALID_STATE_ERR:11
},H.prototype.toString=function(){
    return this.message
    },a.dom={
    arrayContains:g,
    isHtmlNamespace:h,
    parentElement:i,
    getNodeIndex:j,
    getNodeLength:k,
    getCommonAncestor:l,
    isAncestorOf:m,
    isOrIsAncestorOf:n,
    getClosestAncestorIn:o,
    isCharacterDataNode:p,
    isTextOrCommentNode:q,
    insertAfter:r,
    splitDataNode:s,
    getDocument:t,
    getWindow:u,
    getIframeWindow:w,
    getIframeDocument:v,
    getBody:x,
    isWindow:y,
    getContentDocument:z,
    getRootContainer:A,
    comparePoints:B,
    inspectNode:C,
    fragmentFromNodeChildren:D,
    createIterator:F,
    DomPosition:G
},a.DOMException=H
}),rangy.createModule("DomRange",function(a,b){
    function g(a,b){
        return a.nodeType!=3&&(c.isOrIsAncestorOf(a,b.startContainer)||c.isOrIsAncestorOf(a,b.endContainer))
        }
        function h(a){
        return c.getDocument(a.startContainer)
        }
        function i(a){
        return new e(a.parentNode,c.getNodeIndex(a))
        }
        function j(a){
        return new e(a.parentNode,c.getNodeIndex(a)+1)
        }
        function k(a,b,d){
        var e=a.nodeType==11?a.firstChild:a;
        return c.isCharacterDataNode(b)?d==b.length?c.insertAfter(a,b):b.parentNode.insertBefore(a,d==0?b:c.splitDataNode(b,d)):d>=b.childNodes.length?b.appendChild(a):b.insertBefore(a,b.childNodes[d]),e
        }
        function l(a,b,d){
        O(a),O(b);
        if(h(b)!=h(a))throw new f("WRONG_DOCUMENT_ERR");
        var e=c.comparePoints(a.startContainer,a.startOffset,b.endContainer,b.endOffset),g=c.comparePoints(a.endContainer,a.endOffset,b.startContainer,b.startOffset);
        return d?e<=0&&g>=0:e<0&&g>0
        }
        function m(a){
        var b;
        for(var c,d=h(a.range).createDocumentFragment(),e;c=a.next();){
            b=a.isPartiallySelectedSubtree(),c=c.cloneNode(!b),b&&(e=a.getSubtreeIterator(),c.appendChild(m(e)),e.detach(!0));
            if(c.nodeType==10)throw new f("HIERARCHY_REQUEST_ERR");
            d.appendChild(c)
            }
            return d
        }
        function n(a,b,d){
        var e,f;
        d=d||{
            stop:!1
            };

        for(var g,h;g=a.next();)if(a.isPartiallySelectedSubtree()){
            if(b(g)===!1){
                d.stop=!0;
                return
            }
            h=a.getSubtreeIterator(),n(h,b,d),h.detach(!0);
            if(d.stop)return
        }else{
            e=c.createIterator(g);
            while(f=e.next())if(b(f)===!1){
                d.stop=!0;
                return
            }
            }
        }
    function o(a){
    var b;
    while(a.next())a.isPartiallySelectedSubtree()?(b=a.getSubtreeIterator(),o(b),b.detach(!0)):a.remove()
        }
        function p(a){
    for(var b,c=h(a.range).createDocumentFragment(),d;b=a.next();){
        a.isPartiallySelectedSubtree()?(b=b.cloneNode(!1),d=a.getSubtreeIterator(),b.appendChild(p(d)),d.detach(!0)):a.remove();
        if(b.nodeType==10)throw new f("HIERARCHY_REQUEST_ERR");
        c.appendChild(b)
        }
        return c
    }
    function q(a,b,c){
    var d=!!b&&!!b.length,e,f=!!c;
    d&&(e=new RegExp("^("+b.join("|")+")$"));
    var g=[];
    return n(new s(a,!1),function(a){
        (!d||e.test(a.nodeType))&&(!f||c(a))&&g.push(a)
        }),g
    }
    function r(a){
    var b=typeof a.getName=="undefined"?"Range":a.getName();
    return"["+b+"("+c.inspectNode(a.startContainer)+":"+a.startOffset+", "+c.inspectNode(a.endContainer)+":"+a.endOffset+")]"
    }
    function s(a,b){
    this.range=a,this.clonePartiallySelectedTextNodes=b;
    if(!a.collapsed){
        this.sc=a.startContainer,this.so=a.startOffset,this.ec=a.endContainer,this.eo=a.endOffset;
        var d=a.commonAncestorContainer;
        this.sc===this.ec&&c.isCharacterDataNode(this.sc)?(this.isSingleCharacterDataNode=!0,this._first=this._last=this._next=this.sc):(this._first=this._next=this.sc===d&&!c.isCharacterDataNode(this.sc)?this.sc.childNodes[this.so]:c.getClosestAncestorIn(this.sc,d,!0),this._last=this.ec===d&&!c.isCharacterDataNode(this.ec)?this.ec.childNodes[this.eo-1]:c.getClosestAncestorIn(this.ec,d,!0))
        }
    }
function t(a){
    this.code=this[a],this.codeName=a,this.message="RangeException: "+this.codeName
    }
    function z(a){
    return function(b,d){
        var e,f=d?b:b.parentNode;
        while(f){
            e=f.nodeType;
            if(c.arrayContains(a,e))return f;
            f=f.parentNode
            }
            return null
        }
    }
function E(a,b){
    if(D(a,b))throw new t("INVALID_NODE_TYPE_ERR")
        }
        function F(a){
    if(!a.startContainer)throw new f("INVALID_STATE_ERR")
        }
        function G(a,b){
    if(!c.arrayContains(b,a.nodeType))throw new t("INVALID_NODE_TYPE_ERR")
        }
        function H(a,b){
    if(b<0||b>(c.isCharacterDataNode(a)?a.length:a.childNodes.length))throw new f("INDEX_SIZE_ERR")
        }
        function I(a,b){
    if(B(a,!0)!==B(b,!0))throw new f("WRONG_DOCUMENT_ERR")
        }
        function J(a){
    if(C(a,!0))throw new f("NO_MODIFICATION_ALLOWED_ERR")
        }
        function K(a,b){
    if(!a)throw new f(b)
        }
        function L(a){
    return!c.arrayContains(v,a.nodeType)&&!B(a,!0)
    }
    function M(a,b){
    return b<=(c.isCharacterDataNode(a)?a.length:a.childNodes.length)
    }
    function N(a){
    return!!a.startContainer&&!!a.endContainer&&!L(a.startContainer)&&!L(a.endContainer)&&M(a.startContainer,a.startOffset)&&M(a.endContainer,a.endOffset)
    }
    function O(a){
    F(a);
    if(!N(a))throw new Error("Range error: Range is no longer valid after DOM mutation ("+a.inspect()+")")
        }
        function T(a,b){
    O(a);
    var d=a.startContainer,e=a.startOffset,f=a.endContainer,g=a.endOffset,h=d===f;
    c.isCharacterDataNode(f)&&g>0&&g<f.length&&c.splitDataNode(f,g,b),c.isCharacterDataNode(d)&&e>0&&e<d.length&&(d=c.splitDataNode(d,e,b),h?(g-=e,f=d):f==d.parentNode&&g>=c.getNodeIndex(d)&&g++,e=0),a.setStartAndEnd(d,e,f,g)
    }
    function bb(){}
function cb(a){
    a.START_TO_START=V,a.START_TO_END=W,a.END_TO_END=X,a.END_TO_START=Y,a.NODE_BEFORE=Z,a.NODE_AFTER=$,a.NODE_BEFORE_AND_AFTER=_,a.NODE_INSIDE=ab
    }
    function db(a){
    cb(a),cb(a.prototype)
    }
    function eb(a,b){
    return function(){
        O(this);
        var d=this.startContainer,e=this.startOffset,f=this.commonAncestorContainer,g=new s(this,!0),h,i;
        d!==f&&(h=c.getClosestAncestorIn(d,f,!0),i=j(h),d=i.node,e=i.offset),n(g,J),g.reset();
        var k=a(g);
        return g.detach(),b(this,d,e,d,e),k
        }
    }
function fb(a,b,e){
    function f(a,b){
        return function(c){
            F(this),G(c,u),G(A(c),v);
            var d=(a?i:j)(c);
            (b?h:k)(this,d.node,d.offset)
            }
        }
    function h(a,d,e){
    var f=a.endContainer,g=a.endOffset;
    if(d!==a.startContainer||e!==a.startOffset){
        if(A(d)!=A(f)||c.comparePoints(d,e,f,g)==1)f=d,g=e;
        b(a,d,e,f,g)
        }
    }
function k(a,d,e){
    var f=a.startContainer,g=a.startOffset;
    if(d!==a.endContainer||e!==a.endOffset){
        if(A(d)!=A(f)||c.comparePoints(d,e,f,g)==-1)f=d,g=e;
        b(a,f,g,d,e)
        }
    }
a.prototype=new bb,d.extend(a.prototype,{
    setStart:function(a,b){
        F(this),E(a,!0),H(a,b),h(this,a,b)
        },
    setEnd:function(a,b){
        F(this),E(a,!0),H(a,b),k(this,a,b)
        },
    setStartAndEnd:function(){
        F(this);
        var a=arguments,c=a[0],d=a[1],e=c,f=d;
        switch(a.length){
            case 3:
                f=a[2];
                break;
            case 4:
                e=a[2],f=a[3]
                }
                b(this,c,d,e,f)
        },
    setStartBefore:f(!0,!0),
    setStartAfter:f(!1,!0),
    setEndBefore:f(!0,!1),
    setEndAfter:f(!1,!1),
    collapse:function(a){
        O(this),a?b(this,this.startContainer,this.startOffset,this.startContainer,this.startOffset):b(this,this.endContainer,this.endOffset,this.endContainer,this.endOffset)
        },
    selectNodeContents:function(a){
        F(this),E(a,!0),b(this,a,0,a,c.getNodeLength(a))
        },
    selectNode:function(a){
        F(this),E(a,!1),G(a,u);
        var c=i(a),d=j(a);
        b(this,c.node,c.offset,d.node,d.offset)
        },
    extractContents:eb(p,b),
    deleteContents:eb(o,b),
    canSurroundContents:function(){
        O(this),J(this.startContainer),J(this.endContainer);
        var a=new s(this,!0),b=a._first&&g(a._first,this)||a._last&&g(a._last,this);
        return a.detach(),!b
        },
    detach:function(){
        e(this)
        },
    splitBoundaries:function(){
        T(this)
        },
    splitBoundariesPreservingPositions:function(a){
        T(this,a)
        },
    normalizeBoundaries:function(){
        O(this);
        var a=this.startContainer,d=this.startOffset,e=this.endContainer,f=this.endOffset,g=function(a){
            var b=a.nextSibling;
            b&&b.nodeType==a.nodeType&&(e=a,f=a.length,a.appendData(b.data),b.parentNode.removeChild(b))
            },h=function(b){
            var g=b.previousSibling;
            if(g&&g.nodeType==b.nodeType){
                a=b;
                var h=b.length;
                d=g.length,b.insertData(0,g.data),g.parentNode.removeChild(g);
                if(a==e)f+=d,e=a;
                else if(e==b.parentNode){
                    var i=c.getNodeIndex(b);
                    f==i?(e=b,f=h):f>i&&f--
                }
            }
        },i=!0;
if(c.isCharacterDataNode(e))e.length==f&&g(e);
    else{
    if(f>0){
        var j=e.childNodes[f-1];
        j&&c.isCharacterDataNode(j)&&g(j)
        }
        i=!this.collapsed
    }
    if(i){
    if(c.isCharacterDataNode(a))d==0&&h(a);
    else if(d<a.childNodes.length){
        var k=a.childNodes[d];
        k&&c.isCharacterDataNode(k)&&h(k)
        }
    }else a=e,d=f;
b(this,a,d,e,f)
},
collapseToPoint:function(a,b){
    F(this),E(a,!0),H(a,b),this.setStartAndEnd(a,b)
    }
}),db(a)
}
function gb(a){
    a.collapsed=a.startContainer===a.endContainer&&a.startOffset===a.endOffset,a.commonAncestorContainer=a.collapsed?a.startContainer:c.getCommonAncestor(a.startContainer,a.endContainer)
    }
    function hb(a,b,c,d,e){
    a.startContainer=b,a.startOffset=c,a.endContainer=d,a.endOffset=e,gb(a)
    }
    function ib(a){
    F(a),a.startContainer=a.startOffset=a.endContainer=a.endOffset=null,a.collapsed=a.commonAncestorContainer=null
    }
    function jb(a){
    this.startContainer=a,this.startOffset=0,this.endContainer=a,this.endOffset=0,gb(this)
    }
    a.requireModules(["DomUtil"]);
var c=a.dom,d=a.util,e=c.DomPosition,f=a.DOMException;
s.prototype={
    _current:null,
    _next:null,
    _first:null,
    _last:null,
    isSingleCharacterDataNode:!1,
    reset:function(){
        this._current=null,this._next=this._first
        },
    hasNext:function(){
        return!!this._next
        },
    next:function(){
        var a=this._current=this._next;
        return a&&(this._next=a!==this._last?a.nextSibling:null,c.isCharacterDataNode(a)&&this.clonePartiallySelectedTextNodes&&(a===this.ec&&(a=a.cloneNode(!0)).deleteData(this.eo,a.length-this.eo),this._current===this.sc&&(a=a.cloneNode(!0)).deleteData(0,this.so))),a
        },
    remove:function(){
        var a=this._current,b,d;
        !c.isCharacterDataNode(a)||a!==this.sc&&a!==this.ec?a.parentNode&&a.parentNode.removeChild(a):(b=a===this.sc?this.so:0,d=a===this.ec?this.eo:a.length,b!=d&&a.deleteData(b,d-b))
        },
    isPartiallySelectedSubtree:function(){
        var a=this._current;
        return g(a,this.range)
        },
    getSubtreeIterator:function(){
        var a;
        if(this.isSingleCharacterDataNode)a=this.range.cloneRange(),a.collapse(!1);
        else{
            a=new jb(h(this.range));
            var b=this._current,d=b,e=0,f=b,g=c.getNodeLength(b);
            c.isOrIsAncestorOf(b,this.sc)&&(d=this.sc,e=this.so),c.isOrIsAncestorOf(b,this.ec)&&(f=this.ec,g=this.eo),hb(a,d,e,f,g)
            }
            return new s(a,this.clonePartiallySelectedTextNodes)
        },
    detach:function(a){
        a&&this.range.detach(),this.range=this._current=this._next=this._first=this._last=this.sc=this.so=this.ec=this.eo=null
        }
    },t.prototype={
    BAD_BOUNDARYPOINTS_ERR:1,
    INVALID_NODE_TYPE_ERR:2
},t.prototype.toString=function(){
    return this.message
    };

var u=[1,3,4,5,7,8,10],v=[2,9,11],w=[5,6,10,12],x=[1,3,4,5,7,8,10,11],y=[1,3,4,5,7,8],A=c.getRootContainer,B=z([9,11]),C=z(w),D=z([6,10,12]),P=document.createElement("style"),Q=!1;
try{
    P.innerHTML="<b>x</b>",Q=P.firstChild.nodeType==3
    }catch(R){}
a.features.htmlParsingConforms=Q;
var S=Q?function(a){
    var b=this.startContainer,d=c.getDocument(b);
    if(!b)throw new f("INVALID_STATE_ERR");
    var e=null;
    return b.nodeType==1?e=b:c.isCharacterDataNode(b)&&(e=c.parentElement(b)),e===null||e.nodeName=="HTML"&&c.isHtmlNamespace(c.getDocument(e).documentElement)&&c.isHtmlNamespace(e)?e=d.createElement("body"):e=e.cloneNode(!1),e.innerHTML=a,c.fragmentFromNodeChildren(e)
    }:function(a){
    F(this);
    var b=h(this),d=b.createElement("body");
    return d.innerHTML=a,c.fragmentFromNodeChildren(d)
    },U=["startContainer","startOffset","endContainer","endOffset","collapsed","commonAncestorContainer"],V=0,W=1,X=2,Y=3,Z=0,$=1,_=2,ab=3;
bb.prototype={
    compareBoundaryPoints:function(a,b){
        O(this),I(this.startContainer,b.startContainer);
        var d,e,f,g,h=a==Y||a==V?"start":"end",i=a==W||a==V?"start":"end";
        return d=this[h+"Container"],e=this[h+"Offset"],f=b[i+"Container"],g=b[i+"Offset"],c.comparePoints(d,e,f,g)
        },
    insertNode:function(a){
        O(this),G(a,x),J(this.startContainer);
        if(c.isOrIsAncestorOf(a,this.startContainer))throw new f("HIERARCHY_REQUEST_ERR");
        var b=k(a,this.startContainer,this.startOffset);
        this.setStartBefore(b)
        },
    cloneContents:function(){
        O(this);
        var a,b;
        if(this.collapsed)return h(this).createDocumentFragment();
        if(this.startContainer===this.endContainer&&c.isCharacterDataNode(this.startContainer))return a=this.startContainer.cloneNode(!0),a.data=a.data.slice(this.startOffset,this.endOffset),b=h(this).createDocumentFragment(),b.appendChild(a),b;
        var d=new s(this,!0);
        return a=m(d),d.detach(),a
        },
    canSurroundContents:function(){
        O(this),J(this.startContainer),J(this.endContainer);
        var a=new s(this,!0),b=a._first&&g(a._first,this)||a._last&&g(a._last,this);
        return a.detach(),!b
        },
    surroundContents:function(a){
        G(a,y);
        if(!this.canSurroundContents())throw new t("BAD_BOUNDARYPOINTS_ERR");
        var b=this.extractContents();
        if(a.hasChildNodes())while(a.lastChild)a.removeChild(a.lastChild);
        k(a,this.startContainer,this.startOffset),a.appendChild(b),this.selectNode(a)
        },
    cloneRange:function(){
        O(this);
        var a=new jb(h(this)),b=U.length,c;
        while(b--)c=U[b],a[c]=this[c];
        return a
        },
    toString:function(){
        O(this);
        var a=this.startContainer;
        if(a===this.endContainer&&c.isCharacterDataNode(a))return a.nodeType==3||a.nodeType==4?a.data.slice(this.startOffset,this.endOffset):"";
        var b=[],d=new s(this,!0);
        return n(d,function(a){
            (a.nodeType==3||a.nodeType==4)&&b.push(a.data)
            }),d.detach(),b.join("")
        },
    compareNode:function(a){
        O(this);
        var b=a.parentNode,d=c.getNodeIndex(a);
        if(!b)throw new f("NOT_FOUND_ERR");
        var e=this.comparePoint(b,d),g=this.comparePoint(b,d+1);
        return e<0?g>0?_:Z:g>0?$:ab
        },
    comparePoint:function(a,b){
        return O(this),K(a,"HIERARCHY_REQUEST_ERR"),I(a,this.startContainer),c.comparePoints(a,b,this.startContainer,this.startOffset)<0?-1:c.comparePoints(a,b,this.endContainer,this.endOffset)>0?1:0
        },
    createContextualFragment:S,
    toHtml:function(){
        O(this);
        var a=this.commonAncestorContainer.parentNode.cloneNode(!1);
        return a.appendChild(this.cloneContents()),a.innerHTML
        },
    intersectsNode:function(a,b){
        O(this),K(a,"NOT_FOUND_ERR");
        if(c.getDocument(a)!==h(this))return!1;
        var d=a.parentNode,e=c.getNodeIndex(a);
        K(d,"NOT_FOUND_ERR");
        var f=c.comparePoints(d,e,this.endContainer,this.endOffset),g=c.comparePoints(d,e+1,this.startContainer,this.startOffset);
        return b?f<=0&&g>=0:f<0&&g>0
        },
    isPointInRange:function(a,b){
        return O(this),K(a,"HIERARCHY_REQUEST_ERR"),I(a,this.startContainer),c.comparePoints(a,b,this.startContainer,this.startOffset)>=0&&c.comparePoints(a,b,this.endContainer,this.endOffset)<=0
        },
    intersectsRange:function(a){
        return l(this,a,!1)
        },
    intersectsOrTouchesRange:function(a){
        return l(this,a,!0)
        },
    intersection:function(a){
        if(this.intersectsRange(a)){
            var b=c.comparePoints(this.startContainer,this.startOffset,a.startContainer,a.startOffset),d=c.comparePoints(this.endContainer,this.endOffset,a.endContainer,a.endOffset),e=this.cloneRange();
            return b==-1&&e.setStart(a.startContainer,a.startOffset),d==1&&e.setEnd(a.endContainer,a.endOffset),e
            }
            return null
        },
    union:function(a){
        if(this.intersectsOrTouchesRange(a)){
            var b=this.cloneRange();
            return c.comparePoints(a.startContainer,a.startOffset,this.startContainer,this.startOffset)==-1&&b.setStart(a.startContainer,a.startOffset),c.comparePoints(a.endContainer,a.endOffset,this.endContainer,this.endOffset)==1&&b.setEnd(a.endContainer,a.endOffset),b
            }
            throw new t("Ranges do not intersect")
        },
    containsNode:function(a,b){
        return b?this.intersectsNode(a,!1):this.compareNode(a)==ab
        },
    containsNodeContents:function(a){
        return this.comparePoint(a,0)>=0&&this.comparePoint(a,c.getNodeLength(a))<=0
        },
    containsRange:function(a){
        var b=this.intersection(a);
        return b!==null&&a.equals(b)
        },
    containsNodeText:function(a){
        var b=this.cloneRange();
        b.selectNode(a);
        var c=b.getNodes([3]);
        if(c.length>0){
            b.setStart(c[0],0);
            var d=c.pop();
            b.setEnd(d,d.length);
            var e=this.containsRange(b);
            return b.detach(),e
            }
            return this.containsNodeContents(a)
        },
    getNodes:function(a,b){
        return O(this),q(this,a,b)
        },
    getDocument:function(){
        return h(this)
        },
    collapseBefore:function(a){
        F(this),this.setEndBefore(a),this.collapse(!1)
        },
    collapseAfter:function(a){
        F(this),this.setStartAfter(a),this.collapse(!0)
        },
    getName:function(){
        return"DomRange"
        },
    equals:function(a){
        return jb.rangesEqual(this,a)
        },
    isValid:function(){
        return N(this)
        },
    inspect:function(){
        return r(this)
        }
    },fb(jb,hb,ib),a.rangePrototype=bb.prototype,d.extend(jb,{
    rangeProperties:U,
    RangeIterator:s,
    copyComparisonConstants:db,
    createPrototypeRange:fb,
    inspect:r,
    getRangeDocument:h,
    rangesEqual:function(a,b){
        return a.startContainer===b.startContainer&&a.startOffset===b.startOffset&&a.endContainer===b.endContainer&&a.endOffset===b.endOffset
        }
    }),a.DomRange=jb,a.RangeException=t
}),rangy.createModule("WrappedRange",function(a,b){
    function h(a,c){
        a=d.getContentDocument(a);
        if(!a)throw b.createError(c+"(): Parameter must be a Document or other DOM node, or a Window object");
        return a
        }
        function i(a){
        var b=a.parentElement(),c=a.duplicate();
        c.collapse(!0);
        var e=c.parentElement();
        c=a.duplicate(),c.collapse(!1);
        var f=c.parentElement(),g=e==f?e:d.getCommonAncestor(e,f);
        return g==b?g:d.getCommonAncestor(b,g)
        }
        function j(a){
        return a.compareEndPoints("StartToEnd",a)==0
        }
        function k(a,b,c,e,g){
        var h=a.duplicate();
        h.collapse(c);
        var i=h.parentElement();
        d.isOrIsAncestorOf(b,i)||(i=b);
        if(!i.canHaveHTML)return new f(i.parentNode,d.getNodeIndex(i));
        var j=d.getDocument(i).createElement("span");
        j.parentNode&&j.parentNode.removeChild(j);
        var k,l=c?"StartToStart":"StartToEnd",m,n,o,p,q=g&&g.containerElement==i?g.nodeIndex:0,r=i.childNodes.length,s=r,t=s;
        for(;;){
            t==r?i.appendChild(j):i.insertBefore(j,i.childNodes[t]),h.moveToElementText(j),k=h.compareEndPoints(l,a);
            if(k==0||q==s)break;
            if(k==-1){
                if(s==q+1)break;
                q=t
                }else s=s==q+1?q:t;
            t=Math.floor((q+s)/2),i.removeChild(j)
            }
            p=j.nextSibling;
        if(k==-1&&p&&d.isCharacterDataNode(p)){
            h.setEndPoint(c?"EndToStart":"EndToEnd",a);
            var u;
            if(/[\r\n]/.test(p.data)){
                var v=h.duplicate(),w=v.text.replace(/\r\n/g,"\r").length;
                u=v.moveStart("character",w);
                while((k=v.compareEndPoints("StartToEnd",v))==-1)u++,v.moveStart("character",1)
                    }else u=h.text.length;
            o=new f(p,u)
            }else m=(e||!c)&&j.previousSibling,n=(e||c)&&j.nextSibling,n&&d.isCharacterDataNode(n)?o=new f(n,0):m&&d.isCharacterDataNode(m)?o=new f(m,m.data.length):o=new f(i,d.getNodeIndex(j));
        return j.parentNode.removeChild(j),{
            boundaryPosition:o,
            nodeInfo:{
                nodeIndex:t,
                containerElement:i
            }
        }
    }
function l(a,b){
    var c,e,f=a.offset,g=d.getDocument(a.node),h,i,j=g.body.createTextRange(),k=d.isCharacterDataNode(a.node);
    return k?(c=a.node,e=c.parentNode):(i=a.node.childNodes,c=f<i.length?i[f]:null,e=a.node),h=g.createElement("span"),h.innerHTML="&#feff;",c?e.insertBefore(h,c):e.appendChild(h),j.moveToElementText(h),j.collapse(!b),e.removeChild(h),k&&j[b?"moveStart":"moveEnd"]("character",f),j
    }
    a.requireModules(["DomUtil","DomRange"]);
var c,d=a.dom,e=a.util,f=d.DomPosition,g=a.DomRange;
if(a.features.implementsDomRange&&(!a.features.implementsTextRange||!a.config.preferTextRange))(function(){
    function h(a){
        var b=f.length,c;
        while(b--)c=f[b],a[c]=a.nativeRange[c];
        a.collapsed=a.startContainer===a.endContainer&&a.startOffset===a.endOffset
        }
        function i(a,b,c,d,e){
        var f=a.startContainer!==b||a.startOffset!=c,g=a.endContainer!==d||a.endOffset!=e,h=!a.equals(a.nativeRange);
        if(f||g||h)a.setEnd(d,e),a.setStart(b,c)
            }
            function j(a){
        a.nativeRange.detach(),a.detached=!0;
        var b=f.length,c;
        while(b--)c=f[b],a[c]=null
            }
            var a,f=g.rangeProperties,k;
    c=function(a){
        if(!a)throw b.createError("WrappedRange: Range must be specified");
        this.nativeRange=a,h(this)
        },g.createPrototypeRange(c,i,j),a=c.prototype,a.selectNode=function(a){
        this.nativeRange.selectNode(a),h(this)
        },a.cloneContents=function(){
        return this.nativeRange.cloneContents()
        },a.surroundContents=function(a){
        this.nativeRange.surroundContents(a),h(this)
        },a.collapse=function(a){
        this.nativeRange.collapse(a),h(this)
        },a.cloneRange=function(){
        return new c(this.nativeRange.cloneRange())
        },a.refresh=function(){
        h(this)
        },a.toString=function(){
        return this.nativeRange.toString()
        };

    var l=document.createTextNode("test");
    d.getBody(document).appendChild(l);
    var m=document.createRange();
    m.setStart(l,0),m.setEnd(l,0);
    try{
        m.setStart(l,1),a.setStart=function(a,b){
            this.nativeRange.setStart(a,b),h(this)
            },a.setEnd=function(a,b){
            this.nativeRange.setEnd(a,b),h(this)
            },k=function(a){
            return function(b){
                this.nativeRange[a](b),h(this)
                }
            }
    }catch(n){
    a.setStart=function(a,b){
        try{
            this.nativeRange.setStart(a,b)
            }catch(c){
            this.nativeRange.setEnd(a,b),this.nativeRange.setStart(a,b)
            }
            h(this)
        },a.setEnd=function(a,b){
        try{
            this.nativeRange.setEnd(a,b)
            }catch(c){
            this.nativeRange.setStart(a,b),this.nativeRange.setEnd(a,b)
            }
            h(this)
        },k=function(a,b){
        return function(c){
            try{
                this.nativeRange[a](c)
                }catch(d){
                this.nativeRange[b](c),this.nativeRange[a](c)
                }
                h(this)
            }
        }
}
a.setStartBefore=k("setStartBefore","setEndBefore"),a.setStartAfter=k("setStartAfter","setEndAfter"),a.setEndBefore=k("setEndBefore","setStartBefore"),a.setEndAfter=k("setEndAfter","setStartAfter"),m.selectNodeContents(l),m.startContainer==l&&m.endContainer==l&&m.startOffset==0&&m.endOffset==l.length?a.selectNodeContents=function(a){
    this.nativeRange.selectNodeContents(a),h(this)
    }:a.selectNodeContents=function(a){
    this.setStart(a,0),this.setEnd(a,g.getEndOffset(a))
    },m.selectNodeContents(l),m.setEnd(l,3);
var o=document.createRange();
o.selectNodeContents(l),o.setEnd(l,4),o.setStart(l,2),m.compareBoundaryPoints(m.START_TO_END,o)==-1&&m.compareBoundaryPoints(m.END_TO_START,o)==1?a.compareBoundaryPoints=function(a,b){
    return b=b.nativeRange||b,a==b.START_TO_END?a=b.END_TO_START:a==b.END_TO_START&&(a=b.START_TO_END),this.nativeRange.compareBoundaryPoints(a,b)
    }:a.compareBoundaryPoints=function(a,b){
    return this.nativeRange.compareBoundaryPoints(a,b.nativeRange||b)
    };

var p=document.createElement("div");
p.innerHTML="123";
var q=p.firstChild;
document.body.appendChild(p),m.setStart(q,1),m.setEnd(q,2),m.deleteContents(),q.data=="13"&&(a.deleteContents=function(){
    this.nativeRange.deleteContents(),h(this)
    },a.extractContents=function(){
    var a=this.nativeRange.extractContents();
    return h(this),a
    }),document.body.removeChild(p),e.isHostMethod(m,"createContextualFragment")&&(a.createContextualFragment=function(a){
    return this.nativeRange.createContextualFragment(a)
    }),d.getBody(document).removeChild(l),m.detach(),o.detach()
})(),a.createNativeRange=function(a){
    return a=h(a,"createNativeRange"),a.createRange()
    };
else if(a.features.implementsTextRange){
    c=function(a){
        this.textRange=a,this.refresh()
        },c.prototype=new g(document),c.prototype.refresh=function(){
        var a,b,c,d=i(this.textRange);
        j(this.textRange)?b=a=k(this.textRange,d,!0,!0).boundaryPosition:(c=k(this.textRange,d,!0,!1),a=c.boundaryPosition,b=k(this.textRange,d,!1,!1,c.nodeInfo).boundaryPosition),this.setStart(a.node,a.offset),this.setEnd(b.node,b.offset)
        },g.copyComparisonConstants(c);
    var m=function(){
        return this
        }();
    typeof m.Range=="undefined"&&(m.Range=c),a.createNativeRange=function(a){
        return a=h(a,"createNativeRange"),a.body.createTextRange()
        }
    }
a.features.implementsTextRange&&(c.rangeToTextRange=function(a){
    if(a.collapsed)return l(new f(a.startContainer,a.startOffset),!0);
    var b=l(new f(a.startContainer,a.startOffset),!0),c=l(new f(a.endContainer,a.endOffset),!1),e=d.getDocument(a.startContainer).body.createTextRange();
    return e.setEndPoint("StartToStart",b),e.setEndPoint("EndToEnd",c),e
    }),c.prototype.getName=function(){
    return"WrappedRange"
    },a.WrappedRange=c,a.createRange=function(b){
    return b=h(b,"createRange"),new c(a.createNativeRange(b))
    },a.createRangyRange=function(a){
    return a=h(a,"createRangyRange"),new g(a)
    },a.createIframeRange=function(c){
    return b.deprecationNotice("createIframeRange()","createRange(iframeEl)"),a.createRange(c)
    },a.createIframeRangyRange=function(c){
    return b.deprecationNotice("createIframeRangyRange()","createRangyRange(iframeEl)"),a.createRangyRange(c)
    },a.addCreateMissingNativeApiListener(function(b){
    var c=b.document;
    typeof c.createRange=="undefined"&&(c.createRange=function(){
        return a.createRange(c)
        }),c=b=null
    })
}),rangy.createModule("WrappedSelection",function(a,b){
    function m(a){
        return typeof a=="string"?a=="backward":!!a
        }
        function n(a,c){
        if(!a)return window;
        if(d.isWindow(a))return a;
        if(a instanceof O)return a.win;
        var e=d.getContentDocument(a);
        if(!e)throw b.createError(c+"(): "+"Parameter must be a Window object or DOM node");
        return d.getWindow(e)
        }
        function o(a){
        return n(a,"getWinSelection").getSelection()
        }
        function p(a){
        return n(a,"getDocSelection").document.selection
        }
        function D(a,b,c){
        var d=c?"end":"start",e=c?"start":"end";
        a.anchorNode=b[d+"Container"],a.anchorOffset=b[d+"Offset"],a.focusNode=b[e+"Container"],a.focusOffset=b[e+"Offset"]
        }
        function E(a){
        var b=a.nativeSelection;
        a.anchorNode=b.anchorNode,a.anchorOffset=b.anchorOffset,a.focusNode=b.focusNode,a.focusOffset=b.focusOffset
        }
        function F(a){
        a.anchorNode=a.focusNode=null,a.anchorOffset=a.focusOffset=0,a.rangeCount=0,a.isCollapsed=!0,a._ranges.length=0
        }
        function G(b){
        var c;
        return b instanceof f?(c=a.createNativeRange(b.getDocument()),c.setEnd(b.endContainer,b.endOffset),c.setStart(b.startContainer,b.startOffset)):b instanceof g?c=b.nativeRange:a.features.implementsDomRange&&b instanceof d.getWindow(b.startContainer).Range&&(c=b),c
        }
        function H(a){
        if(!a.length||a[0].nodeType!=1)return!1;
        for(var b=1,c=a.length;b<c;++b)if(!d.isAncestorOf(a[0],a[b]))return!1;return!0
        }
        function I(a){
        var c=a.getNodes();
        if(!H(c))throw b.createError("getSingleElementFromRange: range "+a.inspect()+" did not consist of a single element");
        return c[0]
        }
        function J(a){
        return!!a&&typeof a.text!="undefined"
        }
        function K(a,b){
        var c=new g(b);
        a._ranges=[c],D(a,c,!1),a.rangeCount=1,a.isCollapsed=c.collapsed
        }
        function L(b){
        b._ranges.length=0;
        if(b.docSelection.type=="None")F(b);
        else{
            var c=b.docSelection.createRange();
            if(J(c))K(b,c);
            else{
                b.rangeCount=c.length;
                var e,f=d.getDocument(c.item(0));
                for(var g=0;g<b.rangeCount;++g)e=a.createRange(f),e.selectNode(c.item(g)),b._ranges.push(e);
                b.isCollapsed=b.rangeCount==1&&b._ranges[0].collapsed,D(b,b._ranges[b.rangeCount-1],!1)
                }
            }
    }
function M(a,c){
    var e=a.docSelection.createRange(),f=I(c),g=d.getDocument(e.item(0)),h=d.getBody(g).createControlRange();
    for(var i=0,j=e.length;i<j;++i)h.add(e.item(i));
    try{
        h.add(f)
        }catch(k){
        throw b.createError("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)")
        }
        h.select(),L(a)
    }
    function O(a,b,c){
    this.nativeSelection=a,this.docSelection=b,this._ranges=[],this.win=c,this.refresh()
    }
    function P(a){
    a.win=a.anchorNode=a.focusNode=a._ranges=null,a.detached=!0
    }
    function R(a,b){
    var c=Q.length,d,e;
    while(c--){
        d=Q[c],e=d.selection;
        if(b=="deleteAll")P(e);
        else if(d.win==a)return b=="delete"?(Q.splice(c,1),!0):e
            }
            return b=="deleteAll"&&(Q.length=0),null
    }
    function T(a,c){
    var e=d.getDocument(c[0].startContainer),f=d.getBody(e).createControlRange();
    for(var g=0,h;g<rangeCount;++g){
        h=I(c[g]);
        try{
            f.add(h)
            }catch(i){
            throw b.createError("setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)")
            }
        }
    f.select(),L(a)
}
function Y(a,b){
    if(a.anchorNode&&d.getDocument(a.anchorNode)!==d.getDocument(b))throw new h("WRONG_DOCUMENT_ERR")
        }
        function Z(a){
    var b=[],c=new i(a.anchorNode,a.anchorOffset),d=new i(a.focusNode,a.focusOffset),e=typeof a.getName=="function"?a.getName():"Selection";
    if(typeof a.rangeCount!="undefined")for(var g=0,h=a.rangeCount;g<h;++g)b[g]=f.inspect(a.getRangeAt(g));
    return"["+e+"(Ranges: "+b.join(", ")+")(anchor: "+c.inspect()+", focus: "+d.inspect()+"]"
    }
    a.requireModules(["DomUtil","DomRange","WrappedRange"]),a.config.checkSelectionRanges=!0;
var c="boolean",d=a.dom,e=a.util,f=a.DomRange,g=a.WrappedRange,h=a.DOMException,i=d.DomPosition,j,k,l="Control",q=a.util.isHostMethod(window,"getSelection"),r=a.util.isHostObject(document,"selection");
a.features.implementsWinGetSelection=q,a.features.implementsDocSelection=r;
var s=r&&(!q||a.config.preferTextRange);
s?(j=p,a.isSelectionValid=function(a){
    var b=n(a,"isSelectionValid").document,c=b.selection;
    return c.type!="None"||d.getDocument(c.createRange().parentElement())==b
    }):q?(j=o,a.isSelectionValid=function(){
    return!0
    }):b.fail("Neither document.selection or window.getSelection() detected."),a.getNativeSelection=j;
var t=j(),u=a.createNativeRange(document),v=d.getBody(document),w=e.areHostProperties(t,["anchorNode","focusNode","anchorOffset","focusOffset"]);
a.features.selectionHasAnchorAndFocus=w;
var x=e.isHostMethod(t,"extend");
a.features.selectionHasExtend=x;
var y=typeof t.rangeCount=="number";
a.features.selectionHasRangeCount=y;
var z=!1,A=!0;
e.areHostMethods(t,["addRange","getRangeAt","removeAllRanges"])&&typeof t.rangeCount=="number"&&a.features.implementsDomRange&&function(){
    var a=window.getSelection();
    if(a){
        var b=d.getBody(document),c=b.appendChild(document.createElement("div"));
        c.contentEditable="false";
        var e=c.appendChild(document.createTextNode("\u00a0\u00a0\u00a0")),f=document.createRange();
        f.setStart(e,1),f.collapse(!0),a.addRange(f),A=a.rangeCount==1,a.removeAllRanges();
        var g=f.cloneRange();
        f.setStart(e,0),g.setEnd(e,3),g.setStart(e,2),a.addRange(f),a.addRange(g),z=a.rangeCount==2,b.removeChild(c),a.removeAllRanges(),f.detach(),g.detach()
        }
    }(),a.features.selectionSupportsMultipleRanges=z,a.features.collapsedNonEditableSelectionsSupported=A;
var B=!1,C;
v&&e.isHostMethod(v,"createControlRange")&&(C=v.createControlRange(),e.areHostProperties(C,["item","add"])&&(B=!0)),a.features.implementsControlRange=B,w?k=function(a){
    return a.anchorNode===a.focusNode&&a.anchorOffset===a.focusOffset
    }:k=function(a){
    return a.rangeCount?a.getRangeAt(a.rangeCount-1).collapsed:!1
    };

var N;
e.isHostMethod(t,"getRangeAt")?N=function(a,b){
    try{
        return a.getRangeAt(b)
        }catch(c){
        return null
        }
    }:w&&(N=function(b){
    var c=d.getDocument(b.anchorNode),e=a.createRange(c);
    return e.setStart(b.anchorNode,b.anchorOffset),e.setEnd(b.focusNode,b.focusOffset),e.collapsed!==this.isCollapsed&&(e.setStart(b.focusNode,b.focusOffset),e.setEnd(b.anchorNode,b.anchorOffset)),e
    });
var Q=[];
a.getSelection=function(a){
    if(a&&a instanceof O)return a.refresh(),a;
    a=n(a,"getSelection");
    var b=R(a),c=j(a),d=r?p(a):null;
    return b?(b.nativeSelection=c,b.docSelection=d,b.refresh()):(b=new O(c,d,a),Q.push({
        win:a,
        selection:b
    })),b
    },a.getIframeSelection=function(c){
    return b.deprecationNotice("getIframeSelection()","getSelection(iframeEl)"),a.getSelection(d.getIframeWindow(c))
    };

var S=O.prototype;
if(!s&&w&&e.areHostMethods(t,["removeAllRanges","addRange"])){
    S.removeAllRanges=function(){
        this.nativeSelection.removeAllRanges(),F(this)
        };

    var U=function(b,c){
        var d=f.getRangeDocument(c),e=a.createRange(d);
        e.collapseToPoint(c.endContainer,c.endOffset),b.nativeSelection.addRange(G(e)),b.nativeSelection.extend(c.startContainer,c.startOffset),b.refresh()
        };

    y?S.addRange=function(b,c){
        if(B&&r&&this.docSelection.type==l)M(this,b);
        else if(m(c)&&x)U(this,b);
        else{
            var d;
            z?d=this.rangeCount:(this.removeAllRanges(),d=0),this.nativeSelection.addRange(G(b).cloneRange()),this.rangeCount=this.nativeSelection.rangeCount;
            if(this.rangeCount==d+1){
                if(a.config.checkSelectionRanges){
                    var e=N(this.nativeSelection,this.rangeCount-1);
                    e&&!f.rangesEqual(e,b)&&(b=new g(e))
                    }
                    this._ranges[this.rangeCount-1]=b,D(this,b,X(this.nativeSelection)),this.isCollapsed=k(this)
                }else this.refresh()
                }
            }:S.addRange=function(a,b){
    m(b)&&x?U(this,a):(this.nativeSelection.addRange(G(a)),this.refresh())
    },S.setRanges=function(a){
    if(B&&a.length>1)T(this,a);
    else{
        this.removeAllRanges();
        for(var b=0,c=a.length;b<c;++b)this.addRange(a[b])
            }
        }
}else{
    if(!(e.isHostMethod(t,"empty")&&e.isHostMethod(u,"select")&&B&&s))return b.fail("No means of selecting a Range or TextRange was found"),!1;
    S.removeAllRanges=function(){
        try{
            this.docSelection.empty();
            if(this.docSelection.type!="None"){
                var a;
                if(this.anchorNode)a=d.getDocument(this.anchorNode);
                else if(this.docSelection.type==l){
                    var b=this.docSelection.createRange();
                    b.length&&(a=d.getDocument(b.item(0)).body.createTextRange())
                    }
                    if(a){
                    var c=a.body.createTextRange();
                    c.select(),this.docSelection.empty()
                    }
                }
        }catch(e){}
F(this)
},S.addRange=function(a){
    this.docSelection.type==l?M(this,a):(g.rangeToTextRange(a).select(),this._ranges[0]=a,this.rangeCount=1,this.isCollapsed=this._ranges[0].collapsed,D(this,a,!1))
    },S.setRanges=function(a){
    this.removeAllRanges();
    var b=a.length;
    b>1?T(this,a):b&&this.addRange(a[0])
    }
}
S.getRangeAt=function(a){
    if(a<0||a>=this.rangeCount)throw new h("INDEX_SIZE_ERR");
    return this._ranges[a].cloneRange()
    };

var V;
if(s)V=function(b){
    var c;
    a.isSelectionValid(b.win)?c=b.docSelection.createRange():(c=d.getBody(b.win.document).createTextRange(),c.collapse(!0)),b.docSelection.type==l?L(b):J(c)?K(b,c):F(b)
    };
else if(e.isHostMethod(t,"getRangeAt")&&typeof t.rangeCount=="number")V=function(b){
    if(B&&r&&b.docSelection.type==l)L(b);
    else{
        b._ranges.length=b.rangeCount=b.nativeSelection.rangeCount;
        if(b.rangeCount){
            for(var c=0,d=b.rangeCount;c<d;++c)b._ranges[c]=new a.WrappedRange(b.nativeSelection.getRangeAt(c));
            D(b,b._ranges[b.rangeCount-1],X(b.nativeSelection)),b.isCollapsed=k(b)
            }else F(b)
            }
        };
else{
    if(!w||typeof t.isCollapsed!=c||typeof u.collapsed!=c||!a.features.implementsDomRange)return b.fail("No means of obtaining a Range or TextRange from the user's selection was found"),!1;
    V=function(a){
        var b,c=a.nativeSelection;
        c.anchorNode?(b=N(c,0),a._ranges=[b],a.rangeCount=1,E(a),a.isCollapsed=k(a)):F(a)
        }
    }
S.refresh=function(a){
    var b=a?this._ranges.slice(0):null,c=this.anchorNode,d=this.anchorOffset;
    V(this);
    if(a){
        var e=b.length;
        if(e!=this._ranges.length)return!0;
        if(this.anchorNode!=c||this.anchorOffset!=d)return!0;
        while(e--)if(!f.rangesEqual(b[e],this._ranges[e]))return!0;
        return!1
        }
    };

var W=function(b,c){
    var d=b.getAllRanges();
    b.removeAllRanges();
    for(var e=0,f=d.length;e<f;++e)a.DomRange.rangesEqual(c,d[e])||b.addRange(d[e]);
    b.rangeCount||F(b)
    };

B?S.removeRange=function(a){
    if(this.docSelection.type==l){
        var b=this.docSelection.createRange(),c=I(a),e=d.getDocument(b.item(0)),f=d.getBody(e).createControlRange(),g,h=!1;
        for(var i=0,j=b.length;i<j;++i)g=b.item(i),g!==c||h?f.add(b.item(i)):h=!0;
        f.select(),L(this)
        }else W(this,a)
        }:S.removeRange=function(a){
    W(this,a)
    };

var X;
!s&&w&&a.features.implementsDomRange?(X=function(a){
    var b=!1;
    return a.anchorNode&&(b=d.comparePoints(a.anchorNode,a.anchorOffset,a.focusNode,a.focusOffset)==1),b
    },S.isBackward=function(){
    return X(this)
    }):X=S.isBackward=function(){
    return!1
    },S.isBackwards=S.isBackward,S.toString=function(){
    var a=[];
    for(var b=0,c=this.rangeCount;b<c;++b)a[b]=""+this._ranges[b];
    return a.join("")
    },S.collapse=function(b,c){
    Y(this,b);
    var d=a.createRange(b);
    d.collapseToPoint(b,c),this.setSingleRange(d),this.isCollapsed=!0
    },S.collapseToStart=function(){
    if(!this.rangeCount)throw new h("INVALID_STATE_ERR");
    var a=this._ranges[0];
    this.collapse(a.startContainer,a.startOffset)
    },S.collapseToEnd=function(){
    if(!this.rangeCount)throw new h("INVALID_STATE_ERR");
    var a=this._ranges[this.rangeCount-1];
    this.collapse(a.endContainer,a.endOffset)
    },S.selectAllChildren=function(b){
    Y(this,b);
    var c=a.createRange(b);
    c.selectNodeContents(b),this.removeAllRanges(),this.addRange(c)
    },S.deleteFromDocument=function(){
    if(B&&r&&this.docSelection.type==l){
        var a=this.docSelection.createRange(),b;
        while(a.length)b=a.item(0),a.remove(b),b.parentNode.removeChild(b);
        this.refresh()
        }else if(this.rangeCount){
        var c=this.getAllRanges();
        if(c.length){
            this.removeAllRanges();
            for(var d=0,e=c.length;d<e;++d)c[d].deleteContents();
            this.addRange(c[e-1])
            }
        }
},S.getAllRanges=function(){
    var a=[];
    for(var b=0,c=this._ranges.length;b<c;++b)a[b]=this.getRangeAt(b);
    return a
    },S.setSingleRange=function(a,b){
    this.removeAllRanges(),this.addRange(a,b)
    },S.containsNode=function(a,b){
    for(var c=0,d=this._ranges.length;c<d;++c)if(this._ranges[c].containsNode(a,b))return!0;return!1
    },S.toHtml=function(){
    var a=[];
    if(this.rangeCount)for(var b=0,c=this._ranges.length;b<c;++b)a.push(this._ranges[b].toHtml());
    return a.join("")
    },S.getName=function(){
    return"WrappedSelection"
    },S.inspect=function(){
    return Z(this)
    },S.detach=function(){
    R(this.win,"delete"),P(this)
    },O.detachAll=function(){
    R(null,"deleteAll")
    },O.inspect=Z,O.isDirectionBackward=m,a.Selection=O,a.selectionPrototype=S,a.addCreateMissingNativeApiListener(function(b){
    typeof b.getSelection=="undefined"&&(b.getSelection=function(){
        return a.getSelection(b)
        }),b=null
    })
})