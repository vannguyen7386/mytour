(function( $ ){
    var SWFUpload = function(settings) {
        settings = settings||{};
        try {
            this.customSettings = {};
            this.settings = {};
            this.eventQueue = [];
            this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
            this.movieElement = null;

            // Setup global control tracking
            SWFUpload.instances[this.movieName] = this;

            // Load the settings.  Load the Flash movie.
            this.initSettings(settings);
            this.loadSupport();
            if (this.swfuploadPreload()) {
                this.loadFlash();
            }

        //this.displayDebugInfo();
        } catch (ex) {
            delete SWFUpload.instances[this.movieName];
            throw ex;
        }
    };


    /* Static members */

    $.Extend(SWFUpload,{
        instances:{},
        movieCount: 0,
        version: "1.0/2.5.0 Update 1/5/2011",
        QUEUE_ERROR: {
            QUEUE_LIMIT_EXCEEDED            : -100,
            FILE_EXCEEDS_SIZE_LIMIT         : -110,
            ZERO_BYTE_FILE                  : -120,
            INVALID_FILETYPE                : -130
        },
        UPLOAD_ERROR: {
            HTTP_ERROR                      : -200,
            MISSING_UPLOAD_URL              : -210,
            IO_ERROR                        : -220,
            SECURITY_ERROR                  : -230,
            UPLOAD_LIMIT_EXCEEDED           : -240,
            UPLOAD_FAILED                   : -250,
            SPECIFIED_FILE_ID_NOT_FOUND     : -260,
            FILE_VALIDATION_FAILED          : -270,
            FILE_CANCELLED                  : -280,
            UPLOAD_STOPPED                  : -290,
            RESIZE                          : -300
        },
        FILE_STATUS: {
            QUEUED       : -1,
            IN_PROGRESS  : -2,
            ERROR        : -3,
            COMPLETE     : -4,
            CANCELLED    : -5
        },
        UPLOAD_TYPE: {
            NORMAL       : -1,
            RESIZED      : -2
        },
        BUTTON_ACTION: {
            SELECT_FILE             : -100,
            SELECT_FILES            : -110,
            START_UPLOAD            : -120,
            JAVASCRIPT              : -130,	// DEPRECATED
            NONE                    : -130
        },
        CURSOR: {
            ARROW : -1,
            HAND  : -2
        },
        WINDOW_MODE: {
            WINDOW       : "window",
            TRANSPARENT  : "transparent",
            OPAQUE       : "opaque"
        },
        RESIZE_ENCODING: {
            JPEG  : -1,
            PNG   : -2
        },
        // Private: takes a URL, determines if it is relative and converts to an absolute URL
        // using the current site. Only processes the URL if it can, otherwise returns the URL untouched
        completeURL: function (url) {
            try {
                var path = "", indexSlash = -1;
                if (typeof(url) !== "string" || url.match(/^https?:\/\//i) || url.match(/^\//) || url === "") {
                    return url;
                }

                indexSlash = window.location.pathname.lastIndexOf("/");
                if (indexSlash <= 0) {
                    path = "/";
                } else {
                    path = window.location.pathname.substr(0, indexSlash) + "/";
                }
                return path + url;
            } catch (ex) {
                return url;
            }
        },
        // Public: assign a new function to onload to use swfobject's domLoad functionality
        onload: function () {}
    });

    $.Extend( SWFUpload.prototype,{
        // Private: initSettings ensures that all the
        // settings are set, getting a default value if one was not assigned.
        initSettings: function (userSettings) {
            this.ensureDefault = function (settingName, defaultValue) {
                var setting = userSettings[settingName];
                if (setting != undefined) {
                    this.settings[settingName] = setting;
                } else {
                    this.settings[settingName] = defaultValue;
                }
            };

            // Upload backend settings
            this.ensureDefault("upload_url", "");
            this.ensureDefault("preserve_relative_urls", false);
            this.ensureDefault("file_post_name","file");
            this.ensureDefault("post_params", {});
            this.ensureDefault("use_query_string", false);
            this.ensureDefault("requeue_on_error", false);
            this.ensureDefault("http_success", []);
            this.ensureDefault("assume_success_timeout", 0);

            // File Settings
            this.ensureDefault("file_types", "*.*");
            this.ensureDefault("file_types_description", "All Files");
            this.ensureDefault("file_size_limit", 0);	// Default zero means "unlimited"
            this.ensureDefault("file_upload_limit", 0);
            this.ensureDefault("file_queue_limit", 0);

            // Flash Settings
            this.ensureDefault("flash_url", "swfupload.swf");
            this.ensureDefault("flash9_url", "swfupload_fp9.swf");
            this.ensureDefault("prevent_swf_caching", true);

            // Button Settings
            this.ensureDefault("button_image_url", "");
            this.ensureDefault("button_width", 1);
            this.ensureDefault("button_height", 1);
            this.ensureDefault("button_text", "");
            this.ensureDefault("button_text_style", "color: #000000; font-size: 16pt;");
            this.ensureDefault("button_text_top_padding", 0);
            this.ensureDefault("button_text_left_padding", 0);
            this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
            this.ensureDefault("button_disabled", false);
            this.ensureDefault("button_placeholder_id", "");
            this.ensureDefault("button_placeholder", null);
            this.ensureDefault("button_cursor", SWFUpload.CURSOR.ARROW);
            this.ensureDefault("button_window_mode", SWFUpload.WINDOW_MODE.WINDOW);

            // Debug Settings
            this.ensureDefault("debug", false);
            this.settings.debug_enabled = this.settings.debug;	// Here to maintain v2 API

            // Event Handlers
            this.settings.return_upload_start_handler = this.returnUploadStart;
            this.ensureDefault("swfupload_preload_handler", null);
            this.ensureDefault("swfupload_load_failed_handler", null);
            this.ensureDefault("swfupload_loaded_handler", null);
            this.ensureDefault("file_dialog_start_handler", null);
            this.ensureDefault("file_queued_handler", null);
            this.ensureDefault("file_queue_error_handler", null);
            this.ensureDefault("file_dialog_complete_handler", null);

            this.ensureDefault("upload_resize_start_handler", null);
            this.ensureDefault("upload_start_handler", null);
            this.ensureDefault("upload_progress_handler", null);
            this.ensureDefault("upload_error_handler", null);
            this.ensureDefault("upload_success_handler", null);
            this.ensureDefault("upload_complete_handler", null);

            this.ensureDefault("mouse_click_handler", null);
            this.ensureDefault("mouse_out_handler", null);
            this.ensureDefault("mouse_over_handler", null);

            this.ensureDefault("debug_handler", this.debugMessage);

            this.ensureDefault("custom_settings", {});

            // Other settings
            this.customSettings = this.settings.custom_settings;

            // Update the flash url if needed
            if (!!this.settings.prevent_swf_caching) {
                this.settings.flash_url = this.settings.flash_url + (this.settings.flash_url.indexOf("?") < 0 ? "?" : "&") + "preventswfcaching=" + new Date().getTime();
                this.settings.flash9_url = this.settings.flash9_url + (this.settings.flash9_url.indexOf("?") < 0 ? "?" : "&") + "preventswfcaching=" + new Date().getTime();
            }

            if (!this.settings.preserve_relative_urls) {
                this.settings.upload_url = SWFUpload.completeURL(this.settings.upload_url);
                this.settings.button_image_url = SWFUpload.completeURL(this.settings.button_image_url);
            }

            delete this.ensureDefault;
        },

        // Initializes the supported functionality based the Flash Player version, state, and event that occur during initialization
        loadSupport: function () {
            this.support = {
                loading : true,//swfobject.hasFlashPlayerVersion("9.0.28"),
                imageResize : true//swfobject.hasFlashPlayerVersion("10.0.0")
            };

        },

        // Private: loadFlash replaces the button_placeholder element with the flash movie.
        loadFlash: function () {
            return true;
            var targetElement, tempParent, wrapperType, flashHTML, els;

            if (!this.support.loading) {
                this.queueEvent("swfupload_load_failed_handler", ["Flash Player doesn't support SWFUpload"]);
                return;
            }

            // Make sure an element with the ID we are going to use doesn't already exist
            if (document.getElementById(this.movieName) !== null) {
                this.support.loading = false;
                this.queueEvent("swfupload_load_failed_handler", ["Element ID already in use"]);
                return;
            }

            // Get the element where we will be placing the flash movie
            targetElement = document.getElementById(this.settings.button_placeholder_id) || this.settings.button_placeholder;

            if (targetElement == undefined) {
                this.support.loading = false;
                this.queueEvent("swfupload_load_failed_handler", ["button place holder not found"]);
                return;
            }

            wrapperType = (targetElement.currentStyle && targetElement.currentStyle["display"] || window.getComputedStyle && document.defaultView.getComputedStyle(targetElement, null).getPropertyValue("display")) !== "block" ? "span" : "div";

            // Append the container and load the flash
            tempParent = document.createElement(wrapperType);

            flashHTML = this.getFlashHTML();

            try {
                tempParent.innerHTML = flashHTML;	// Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)
            } catch (ex) {
                this.support.loading = false;
                this.queueEvent("swfupload_load_failed_handler", ["Exception loading Flash HTML into placeholder"]);
                return;
            }

            // Try to get the movie element immediately
            els = tempParent.getElementsByTagName("object");
            if (!els || els.length > 1 || els.length === 0) {
                this.support.loading = false;
                this.queueEvent("swfupload_load_failed_handler", ["Unable to find movie after adding to DOM"]);
                return;
            } else if (els.length === 1) {
                this.movieElement = els[0];
            }

            targetElement.parentNode.replaceChild(tempParent.firstChild, targetElement);

            // Fix IE Flash/Form bug
            if (window[this.movieName] == undefined) {
                window[this.movieName] = this.getMovieElement();
            }
        },

        // Private: getFlashHTML generates the object tag needed to embed the flash in to the document
        getFlashHTML: function (flashVersion) {
            // Flash Satay object syntax: http://www.alistapart.com/articles/flashsatay
            return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', (this.support.imageResize ? this.settings.flash_url : this.settings.flash9_url), '" width="', this.settings.button_width, '" height="', this.settings.button_height, '" class="swfupload">',
            '<param name="wmode" value="', this.settings.button_window_mode, '" />',
            '<param name="movie" value="', (this.support.imageResize ? this.settings.flash_url : this.settings.flash9_url), '" />',
            '<param name="quality" value="high" />',
            '<param name="allowScriptAccess" value="always" />',
            '<param name="flashvars" value="' + this.getFlashVars() + '" />',
            '</object>'].join("");
        },

        // Private: getFlashVars builds the parameter string that will be passed
        // to flash in the flashvars param.
        getFlashVars: function () {
            // Build a string from the post param object
            var httpSuccessString, paramString;

            paramString = this.buildParamString();
            httpSuccessString = this.settings.http_success.join(",");

            // Build the parameter string
            return ["movieName=", encodeURIComponent(this.movieName),
            "&amp;uploadURL=", encodeURIComponent(this.settings.upload_url),
            "&amp;useQueryString=", encodeURIComponent(this.settings.use_query_string),
            "&amp;requeueOnError=", encodeURIComponent(this.settings.requeue_on_error),
            "&amp;httpSuccess=", encodeURIComponent(httpSuccessString),
            "&amp;assumeSuccessTimeout=", encodeURIComponent(this.settings.assume_success_timeout),
            "&amp;params=", encodeURIComponent(paramString),
            "&amp;filePostName=", encodeURIComponent(this.settings.file_post_name),
            "&amp;fileTypes=", encodeURIComponent(this.settings.file_types),
            "&amp;fileTypesDescription=", encodeURIComponent(this.settings.file_types_description),
            "&amp;fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit),
            "&amp;fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit),
            "&amp;fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit),
            "&amp;debugEnabled=", encodeURIComponent(this.settings.debug_enabled),
            "&amp;buttonImageURL=", encodeURIComponent(this.settings.button_image_url),
            "&amp;buttonWidth=", encodeURIComponent(this.settings.button_width),
            "&amp;buttonHeight=", encodeURIComponent(this.settings.button_height),
            "&amp;buttonText=", encodeURIComponent(this.settings.button_text),
            "&amp;buttonTextTopPadding=", encodeURIComponent(this.settings.button_text_top_padding),
            "&amp;buttonTextLeftPadding=", encodeURIComponent(this.settings.button_text_left_padding),
            "&amp;buttonTextStyle=", encodeURIComponent(this.settings.button_text_style),
            "&amp;buttonAction=", encodeURIComponent(this.settings.button_action),
            "&amp;buttonDisabled=", encodeURIComponent(this.settings.button_disabled),
            "&amp;buttonCursor=", encodeURIComponent(this.settings.button_cursor)
            ].join("");
        },

        // Public: get retrieves the DOM reference to the Flash element added by SWFUpload
        // The element is cached after the first lookup
        getMovieElement: function () {
            if (this.movieElement == undefined) {
                this.movieElement = document.getElementById(this.movieName);
            }

            if (this.movieElement === null) {
                throw "Could not find Flash element";
            }

            return this.movieElement;
        },

        // Private: buildParamString takes the name/value pairs in the post_params setting object
        // and joins them up in to a string formatted "name=value&amp;name=value"
        buildParamString: function () {
            var name, postParams, paramStringPairs = [];

            postParams = this.settings.post_params;

            if (typeof(postParams) === "object") {
                for (name in postParams) {
                    if (postParams.hasOwnProperty(name)) {
                        paramStringPairs.push(encodeURIComponent(name.toString()) + "=" + encodeURIComponent(postParams[name].toString()));
                    }
                }
            }

            return paramStringPairs.join("&amp;");
        },

        // Public: Used to remove a SWFUpload instance from the page. This method strives to remove
        // all references to the SWF, and other objects so memory is properly freed.
        // Returns true if everything was destroyed. Returns a false if a failure occurs leaving SWFUpload in an inconsistant state.
        // Credits: Major improvements provided by steffen
        destroy: function () {
            var movieElement;

            try {
                // Make sure Flash is done before we try to remove it
                this.cancelUpload(null, false);

                movieElement = this.cleanUp();

                // Remove the SWFUpload DOM nodes
                if (movieElement) {
                    // Remove the Movie Element from the page
                    try {
                        movieElement.parentNode.removeChild(movieElement);
                    } catch (ex) {}
                }

                // Remove IE form fix reference
                window[this.movieName] = null;

                // Destroy other references
                SWFUpload.instances[this.movieName] = null;
                delete SWFUpload.instances[this.movieName];

                this.movieElement = null;
                this.settings = null;
                this.customSettings = null;
                this.eventQueue = null;
                this.movieName = null;


                return true;
            } catch (ex2) {
                return false;
            }
        },

        // Public: displayDebugInfo prints out settings and configuration
        // information about this SWFUpload instance.
        // This function (and any references to it) can be deleted when placing
        // SWFUpload in production.
        displayDebugInfo: function () {
            this.debug(
                [
                "---SWFUpload Instance Info---\n",
                "Version: ", SWFUpload.version, "\n",
                "Movie Name: ", this.movieName, "\n",
                "Settings:\n",
                "\t", "upload_url:               ", this.settings.upload_url, "\n",
                "\t", "flash_url:                ", this.settings.flash_url, "\n",
                "\t", "flash9_url:                ", this.settings.flash9_url, "\n",
                "\t", "use_query_string:         ", this.settings.use_query_string.toString(), "\n",
                "\t", "requeue_on_error:         ", this.settings.requeue_on_error.toString(), "\n",
                "\t", "http_success:             ", this.settings.http_success.join(", "), "\n",
                "\t", "assume_success_timeout:   ", this.settings.assume_success_timeout, "\n",
                "\t", "file_post_name:           ", this.settings.file_post_name, "\n",
                "\t", "post_params:              ", this.settings.post_params.toString(), "\n",
                "\t", "file_types:               ", this.settings.file_types, "\n",
                "\t", "file_types_description:   ", this.settings.file_types_description, "\n",
                "\t", "file_size_limit:          ", this.settings.file_size_limit, "\n",
                "\t", "file_upload_limit:        ", this.settings.file_upload_limit, "\n",
                "\t", "file_queue_limit:         ", this.settings.file_queue_limit, "\n",
                "\t", "debug:                    ", this.settings.debug.toString(), "\n",

                "\t", "prevent_swf_caching:      ", this.settings.prevent_swf_caching.toString(), "\n",

                "\t", "button_placeholder_id:    ", this.settings.button_placeholder_id.toString(), "\n",
                "\t", "button_placeholder:       ", (this.settings.button_placeholder ? "Set" : "Not Set"), "\n",
                "\t", "button_image_url:         ", this.settings.button_image_url.toString(), "\n",
                "\t", "button_width:             ", this.settings.button_width.toString(), "\n",
                "\t", "button_height:            ", this.settings.button_height.toString(), "\n",
                "\t", "button_text:              ", this.settings.button_text.toString(), "\n",
                "\t", "button_text_style:        ", this.settings.button_text_style.toString(), "\n",
                "\t", "button_text_top_padding:  ", this.settings.button_text_top_padding.toString(), "\n",
                "\t", "button_text_left_padding: ", this.settings.button_text_left_padding.toString(), "\n",
                "\t", "button_action:            ", this.settings.button_action.toString(), "\n",
                "\t", "button_cursor:            ", this.settings.button_cursor.toString(), "\n",
                "\t", "button_disabled:          ", this.settings.button_disabled.toString(), "\n",

                "\t", "custom_settings:          ", this.settings.custom_settings.toString(), "\n",
                "Event Handlers:\n",
                "\t", "swfupload_preload_handler assigned:  ", (typeof this.settings.swfupload_preload_handler === "function").toString(), "\n",
                "\t", "swfupload_load_failed_handler assigned:  ", (typeof this.settings.swfupload_load_failed_handler === "function").toString(), "\n",
                "\t", "swfupload_loaded_handler assigned:  ", (typeof this.settings.swfupload_loaded_handler === "function").toString(), "\n",
                "\t", "mouse_click_handler assigned:       ", (typeof this.settings.mouse_click_handler === "function").toString(), "\n",
                "\t", "mouse_over_handler assigned:        ", (typeof this.settings.mouse_over_handler === "function").toString(), "\n",
                "\t", "mouse_out_handler assigned:         ", (typeof this.settings.mouse_out_handler === "function").toString(), "\n",
                "\t", "file_dialog_start_handler assigned: ", (typeof this.settings.file_dialog_start_handler === "function").toString(), "\n",
                "\t", "file_queued_handler assigned:       ", (typeof this.settings.file_queued_handler === "function").toString(), "\n",
                "\t", "file_queue_error_handler assigned:  ", (typeof this.settings.file_queue_error_handler === "function").toString(), "\n",
                "\t", "upload_resize_start_handler assigned:      ", (typeof this.settings.upload_resize_start_handler === "function").toString(), "\n",
                "\t", "upload_start_handler assigned:      ", (typeof this.settings.upload_start_handler === "function").toString(), "\n",
                "\t", "upload_progress_handler assigned:   ", (typeof this.settings.upload_progress_handler === "function").toString(), "\n",
                "\t", "upload_error_handler assigned:      ", (typeof this.settings.upload_error_handler === "function").toString(), "\n",
                "\t", "upload_success_handler assigned:    ", (typeof this.settings.upload_success_handler === "function").toString(), "\n",
                "\t", "upload_complete_handler assigned:   ", (typeof this.settings.upload_complete_handler === "function").toString(), "\n",
                "\t", "debug_handler assigned:             ", (typeof this.settings.debug_handler === "function").toString(), "\n",

                "Support:\n",
                "\t", "Load:                     ", (this.support.loading ? "Yes" : "No"), "\n",
                "\t", "Image Resize:             ", (this.support.imageResize ? "Yes" : "No"), "\n"

                ].join("")
                );
        },

        /* Note: addSetting and getSetting are no longer used by SWFUpload but are included
			the maintain v2 API compatibility
		*/
        // Public: (Deprecated) addSetting adds a setting value. If the value given is undefined or null then the default_value is used.
        addSetting: function (name, value, default_value) {
            if (value == undefined) {
                return (this.settings[name] = default_value);
            } else {
                return (this.settings[name] = value);
            }
        },

        // Public: (Deprecated) getSetting gets a setting. Returns an empty string if the setting was not found.
        getSetting: function (name) {
            if (this.settings[name] != undefined) {
                return this.settings[name];
            }

            return "";
        },

        // Private: callFlash handles function calls made to the Flash element.
        // Calls are made with a setTimeout for some functions to work around
        // bugs in the ExternalInterface library.
        callFlash: function (functionName, argumentArray) {
            var movieElement, returnValue, returnString;

            argumentArray = argumentArray || [];
            movieElement = this.getMovieElement();

            // Flash's method if calling ExternalInterface methods (code adapted from MooTools).
            try {
                if (movieElement != undefined) {
                    returnString = movieElement.CallFunction('<invoke name="' + functionName + '" returntype="javascript">' + __flash__argumentsToXML(argumentArray, 0) + '</invoke>');
                    returnValue = eval(returnString);
                } else {
                    this.debug("Can't call flash because the movie wasn't found.");
                }
            } catch (ex) {
                this.debug("Exception calling flash function '" + functionName + "': " + ex.message);
            }

            // Unescape file post param values
            if (returnValue != undefined && typeof returnValue.post === "object") {
                returnValue = this.unescapeFilePostParams(returnValue);
            }

            return returnValue;
        },

        /* *****************************
			-- Flash control methods --
			Your UI should use these
			to operate SWFUpload
		   ***************************** */

        // WARNING: this function does not work in Flash Player 10
        // Public: selectFile causes a File Selection Dialog window to appear.  This
        // dialog only allows 1 file to be selected.
        selectFile: function () {
            this.callFlash("SelectFile");
        },

        // WARNING: this function does not work in Flash Player 10
        // Public: selectFiles causes a File Selection Dialog window to appear/ This
        // dialog allows the user to select any number of files
        // Flash Bug Warning: Flash limits the number of selectable files based on the combined length of the file names.
        // If the selection name length is too long the dialog will fail in an unpredictable manner.  There is no work-around
        // for this bug.
        selectFiles: function () {
            this.callFlash("SelectFiles");
        },

        // Public: startUpload starts uploading the first file in the queue unless
        // the optional parameter 'fileID' specifies the ID
        startUpload: function (fileID) {
            this.callFlash("StartUpload", [fileID]);
        },

        // Public: startUpload starts uploading the first file in the queue unless
        // the optional parameter 'fileID' specifies the ID
        startResizedUpload: function (fileID, width, height, encoding, quality, allowEnlarging) {
            this.callFlash("StartUpload", [fileID, {
                "width": width,
                "height" : height,
                "encoding" : encoding,
                "quality" : quality,
                "allowEnlarging" : allowEnlarging
            }]);
        },

        // Public: cancelUpload cancels any queued file.  The fileID parameter may be the file ID or index.
        // If you do not specify a fileID the current uploading file or first file in the queue is cancelled.
        // If you do not want the uploadError event to trigger you can specify false for the triggerErrorEvent parameter.
        cancelUpload: function (fileID, triggerErrorEvent) {
            if (triggerErrorEvent !== false) {
                triggerErrorEvent = true;
            }
            this.callFlash("CancelUpload", [fileID, triggerErrorEvent]);
        },

        // Public: stopUpload stops the current upload and requeues the file at the beginning of the queue.
        // If nothing is currently uploading then nothing happens.
        stopUpload: function () {
            this.callFlash("StopUpload");
        },

        // Public: requeueUpload requeues any file. If the file is requeued or already queued true is returned.
        // If the file is not found or is currently uploading false is returned.  Requeuing a file bypasses the
        // file size, queue size, upload limit and other queue checks.  Certain files can't be requeued (e.g, invalid or zero bytes files).
        requeueUpload: function (indexOrFileID) {
            return this.callFlash("RequeueUpload", [indexOrFileID]);
        },


        /* ************************
		 * Settings methods
		 *   These methods change the SWFUpload settings.
		 *   SWFUpload settings should not be changed directly on the settings object
		 *   since many of the settings need to be passed to Flash in order to take
		 *   effect.
		 * *********************** */

        // Public: getStats gets the file statistics object.
        getStats: function () {
            return this.callFlash("GetStats");
        },

        // Public: setStats changes the SWFUpload statistics.  You shouldn't need to
        // change the statistics but you can.  Changing the statistics does not
        // affect SWFUpload accept for the successful_uploads count which is used
        // by the upload_limit setting to determine how many files the user may upload.
        setStats: function (statsObject) {
            this.callFlash("SetStats", [statsObject]);
        },

        // Public: getFile retrieves a File object by ID or Index.  If the file is
        // not found then 'null' is returned.
        getFile: function (fileID) {
            if (typeof(fileID) === "number") {
                return this.callFlash("GetFileByIndex", [fileID]);
            } else {
                return this.callFlash("GetFile", [fileID]);
            }
        },

        // Public: getFileFromQueue retrieves a File object by ID or Index.  If the file is
        // not found then 'null' is returned.
        getQueueFile: function (fileID) {
            if (typeof(fileID) === "number") {
                return this.callFlash("GetFileByQueueIndex", [fileID]);
            } else {
                return this.callFlash("GetFile", [fileID]);
            }
        },

        // Public: addFileParam sets a name/value pair that will be posted with the
        // file specified by the Files ID.  If the name already exists then the
        // exiting value will be overwritten.
        addFileParam: function (fileID, name, value) {
            return this.callFlash("AddFileParam", [fileID, name, value]);
        },

        // Public: removeFileParam removes a previously set (by addFileParam) name/value
        // pair from the specified file.
        removeFileParam: function (fileID, name) {
            this.callFlash("RemoveFileParam", [fileID, name]);
        },

        // Public: setUploadUrl changes the upload_url setting.
        setUploadURL: function (url) {
            this.settings.upload_url = url.toString();
            this.callFlash("SetUploadURL", [url]);
        },

        // Public: setPostParams changes the post_params setting
        setPostParams: function (paramsObject) {
            this.settings.post_params = paramsObject;
            this.callFlash("SetPostParams", [paramsObject]);
        },

        // Public: addPostParam adds post name/value pair.  Each name can have only one value.
        addPostParam: function (name, value) {
            this.settings.post_params[name] = value;
            this.callFlash("SetPostParams", [this.settings.post_params]);
        },

        // Public: removePostParam deletes post name/value pair.
        removePostParam: function (name) {
            delete this.settings.post_params[name];
            this.callFlash("SetPostParams", [this.settings.post_params]);
        },

        // Public: setFileTypes changes the file_types setting and the file_types_description setting
        setFileTypes: function (types, description) {
            this.settings.file_types = types;
            this.settings.file_types_description = description;
            this.callFlash("SetFileTypes", [types, description]);
        },

        // Public: setFileSizeLimit changes the file_size_limit setting
        setFileSizeLimit: function (fileSizeLimit) {
            this.settings.file_size_limit = fileSizeLimit;
            this.callFlash("SetFileSizeLimit", [fileSizeLimit]);
        },

        // Public: setFileUploadLimit changes the file_upload_limit setting
        setFileUploadLimit: function (fileUploadLimit) {
            this.settings.file_upload_limit = fileUploadLimit;
            this.callFlash("SetFileUploadLimit", [fileUploadLimit]);
        },

        // Public: setFileQueueLimit changes the file_queue_limit setting
        setFileQueueLimit: function (fileQueueLimit) {
            this.settings.file_queue_limit = fileQueueLimit;
            this.callFlash("SetFileQueueLimit", [fileQueueLimit]);
        },

        // Public: setFilePostName changes the file_post_name setting
        setFilePostName: function (filePostName) {
            this.settings.file_post_name = filePostName;
            this.callFlash("SetFilePostName", [filePostName]);
        },

        // Public: setUseQueryString changes the use_query_string setting
        setUseQueryString: function (useQueryString) {
            this.settings.use_query_string = useQueryString;
            this.callFlash("SetUseQueryString", [useQueryString]);
        },

        // Public: setRequeueOnError changes the requeue_on_error setting
        setRequeueOnError: function (requeueOnError) {
            this.settings.requeue_on_error = requeueOnError;
            this.callFlash("SetRequeueOnError", [requeueOnError]);
        },

        // Public: setHTTPSuccess changes the http_success setting
        setHTTPSuccess: function (http_status_codes) {
            if (typeof http_status_codes === "string") {
                http_status_codes = http_status_codes.replace(" ", "").split(",");
            }

            this.settings.http_success = http_status_codes;
            this.callFlash("SetHTTPSuccess", [http_status_codes]);
        },

        // Public: setHTTPSuccess changes the http_success setting
        setAssumeSuccessTimeout: function (timeout_seconds) {
            this.settings.assume_success_timeout = timeout_seconds;
            this.callFlash("SetAssumeSuccessTimeout", [timeout_seconds]);
        },

        // Public: setDebugEnabled changes the debug_enabled setting
        setDebugEnabled: function (debugEnabled) {
            this.settings.debug_enabled = debugEnabled;
            this.callFlash("SetDebugEnabled", [debugEnabled]);
        },

        // Public: setButtonImageURL loads a button image sprite
        setButtonImageURL: function (buttonImageURL) {
            if (buttonImageURL == undefined) {
                buttonImageURL = "";
            }

            this.settings.button_image_url = buttonImageURL;
            this.callFlash("SetButtonImageURL", [buttonImageURL]);
        },

        // Public: setButtonDimensions resizes the Flash Movie and button
        setButtonDimensions: function (width, height) {
            this.settings.button_width = width;
            this.settings.button_height = height;

            var movie = this.getMovieElement();
            if (movie != undefined) {
                movie.style.width = width + "px";
                movie.style.height = height + "px";
            }

            this.callFlash("SetButtonDimensions", [width, height]);
        },
        // Public: setButtonText Changes the text overlaid on the button
        setButtonText: function (html) {
            this.settings.button_text = html;
            this.callFlash("SetButtonText", [html]);
        },
        // Public: setButtonTextPadding changes the top and left padding of the text overlay
        setButtonTextPadding: function (left, top) {
            this.settings.button_text_top_padding = top;
            this.settings.button_text_left_padding = left;
            this.callFlash("SetButtonTextPadding", [left, top]);
        },

        // Public: setButtonTextStyle changes the CSS used to style the HTML/Text overlaid on the button
        setButtonTextStyle: function (css) {
            this.settings.button_text_style = css;
            this.callFlash("SetButtonTextStyle", [css]);
        },
        // Public: setButtonDisabled disables/enables the button
        setButtonDisabled: function (isDisabled) {
            this.settings.button_disabled = isDisabled;
            this.callFlash("SetButtonDisabled", [isDisabled]);
        },
        // Public: setButtonAction sets the action that occurs when the button is clicked
        setButtonAction: function (buttonAction) {
            this.settings.button_action = buttonAction;
            this.callFlash("SetButtonAction", [buttonAction]);
        },

        // Public: setButtonCursor changes the mouse cursor displayed when hovering over the button
        setButtonCursor: function (cursor) {
            this.settings.button_cursor = cursor;
            this.callFlash("SetButtonCursor", [cursor]);
        },

        /* *******************************
			Flash Event Interfaces
			These functions are used by Flash to trigger the various
			events.

			All these functions a Private.

			Because the ExternalInterface library is buggy the event calls
			are added to a queue and the queue then executed by a setTimeout.
			This ensures that events are executed in a determinate order and that
			the ExternalInterface bugs are avoided.
		******************************* */

        queueEvent: function (handlerName, argumentArray) {
            // Warning: Don't call this.debug inside here or you'll create an infinite loop
            var self = this;

            if (argumentArray == undefined) {
                argumentArray = [];
            } else if (!(argumentArray instanceof Array)) {
                argumentArray = [argumentArray];
            }

            if (typeof this.settings[handlerName]=== "function") {
                // Queue the event
                this.eventQueue.push(function () {
                    this.settings[handlerName].apply(this, argumentArray);
                });

                // Execute the next queued event
                setTimeout(function () {
                    self.executeNextEvent();
                }, 0);

            } else if (this.settings[handlerName] !== null) {
                throw "Event handler " + handlerName + " is unknown or is not a function";
            }
        },

        // Private: Causes the next event in the queue to be executed.  Since events are queued using a setTimeout
        // we must queue them in order to garentee that they are executed in order.
        executeNextEvent: function () {
            // Warning: Don't call this.debug inside here or you'll create an infinite loop

            var  f = this.eventQueue ? this.eventQueue.shift() : null;
            if (typeof(f)=== "function") {
                f.apply(this);
            }
        },

        // Private: unescapeFileParams is part of a workaround for a flash bug where objects passed through ExternalInterface cannot have
        // properties that contain characters that are not valid for JavaScript identifiers. To work around this
        // the Flash Component escapes the parameter names and we must unescape again before passing them along.
        unescapeFilePostParams: function (file) {
            var reg = /[$]([0-9a-f]{4})/i, unescapedPost = {}, uk, k, match;

            if (file != undefined) {
                for (k in file.post) {
                    if (file.post.hasOwnProperty(k)) {
                        uk = k;
                        while ((match = reg.exec(uk)) !== null) {
                            uk = uk.replace(match[0], String.fromCharCode(parseInt("0x" + match[1], 16)));
                        }
                        unescapedPost[uk] = file.post[k];
                    }
                }

                file.post = unescapedPost;
            }

            return file;
        },

        // Private: This event is called by SWFUpload Init after we've determined what the user's Flash Player supports.
        // Use the swfupload_preload_handler event setting to execute custom code when SWFUpload has loaded.
        // Return false to prevent SWFUpload from loading and allow your script to do something else if your required feature is
        // not supported
        swfuploadPreload: function () {
            var returnValue;
            if (typeof this.settings.swfupload_preload_handler === "function") {
                returnValue = this.settings.swfupload_preload_handler.call(this);
            } else if (this.settings.swfupload_preload_handler != undefined) {
                throw "upload_start_handler must be a function";
            }

            // Convert undefined to true so if nothing is returned from the upload_start_handler it is
            // interpretted as 'true'.
            if (returnValue=== undefined) {
                returnValue = true;
            }

            return !!returnValue;
        },

        // Private: This event is called by Flash when it has finished loading. Don't modify this.
        // Use the swfupload_loaded_handler event setting to execute custom code when SWFUpload has loaded.
        flashReady: function () {
            // Check that the movie element is loaded correctly with its ExternalInterface methods defined
            var movieElement = this.cleanUp();

            if (!movieElement) {
                this.debug("Flash called back ready but the flash movie can't be found.");
                return;
            }

            this.queueEvent("swfupload_loaded_handler");
        },

        // Private: removes Flash added fuctions to the DOM node to prevent memory leaks in IE.
        // This function is called by Flash each time the ExternalInterface functions are created.
        cleanUp: function () {
            var key, movieElement = this.getMovieElement();

            // Pro-actively unhook all the Flash functions
            try {
                if (movieElement && typeof(movieElement.CallFunction)=== "unknown") { // We only want to do this in IE
                    this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
                    for (key in movieElement) {
                        try {
                            if (typeof(movieElement[key])=== "function") {
                                movieElement[key] = null;
                            }
                        } catch (ex) {
                        }
                    }
                }
            } catch (ex1) {

            }

            // Fix Flashes own cleanup code so if the SWF Movie was removed from the page
            // it doesn't display errors.
            window["__flash__removeCallback"] = function (instance, name) {
                try {
                    if (instance) {
                        instance[name] = null;
                    }
                } catch (flashEx) {

                }
            }
            return movieElement;
        },

        /* When the button_action is set to None this event gets fired and executes the mouse_click_handler */
        mouseClick: function () {
            this.queueEvent("mouse_click_handler");
        },
        mouseOver: function () {
            this.queueEvent("mouse_over_handler");
        },
        mouseOut: function () {
            this.queueEvent("mouse_out_handler");
        },

        /* This is a chance to do something before the browse window opens */
        fileDialogStart: function () {
            this.queueEvent("file_dialog_start_handler");
        },


        /* Called when a file is successfully added to the queue. */
        fileQueued: function (file) {
            file: this.unescapeFilePostParams(file);
        this.queueEvent("file_queued_handler", file);
        },


        /* Handle errors that occur when an attempt to queue a file fails. */
        fileQueueError: function (file, errorCode, message) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("file_queue_error_handler", [file, errorCode, message]);
        },

        /* Called after the file dialog has closed and the selected files have been queued.
			You could call startUpload here if you want the queued files to begin uploading immediately. */
        fileDialogComplete: function (numFilesSelected, numFilesQueued, numFilesInQueue) {
            this.queueEvent("file_dialog_complete_handler", [numFilesSelected, numFilesQueued, numFilesInQueue]);
        },

        uploadResizeStart: function (file, resizeSettings) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("upload_resize_start_handler", [file, resizeSettings.width, resizeSettings.height, resizeSettings.encoding, resizeSettings.quality]);
        },

        uploadStart: function (file) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("return_upload_start_handler", file);
        },

        returnUploadStart: function (file) {
            var returnValue;
            if (typeof this.settings.upload_start_handler === "function") {
                file = this.unescapeFilePostParams(file);
                returnValue = this.settings.upload_start_handler.call(this, file);
            } else if (this.settings.upload_start_handler != undefined) {
                throw "upload_start_handler must be a function";
            }

            // Convert undefined to true so if nothing is returned from the upload_start_handler it is
            // interpretted as 'true'.
            if (returnValue=== undefined) {
                returnValue = true;
            }

                returnValue: !!returnValue;

            this.callFlash("ReturnUploadStart", [returnValue]);
        },

        uploadProgress: function (file, bytesComplete, bytesTotal) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("upload_progress_handler", [file, bytesComplete, bytesTotal]);
        },

        uploadError: function (file, errorCode, message) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("upload_error_handler", [file, errorCode, message]);
        },

        uploadSuccess: function ( file, serverData, responseReceived ) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("upload_success_handler", [file, serverData, responseReceived]);
        },

        uploadComplete: function (file) {
            file = this.unescapeFilePostParams(file);
            this.queueEvent("upload_complete_handler", file);
        },

        debug: function (message) {

        }
    });

    window.SWFUpload = SWFUpload;

})(Owl)