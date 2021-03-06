define(["jquery", "underscore", "webuploader", "jquery.jplayer", "bootstrap", "filestyle"], function(a, b, c) {
	var d = {
		defaultoptions: {
			direct: !1,
			global: !1,
			callback: null,
			type: "image",
			mode: "",
			multiple: !1,
			uploader: {}
		},
		uploader: {},
		show: function(a, b) {
			this.init(a, b)
		},
		init: function(b, c) {
			var d = this;
			return c.account_error ? (util.message("公众号号没有上传素材的权限", "", "info"), !1) : (d.options = a.extend({}, d.defaultoptions, c), d.options.callback = b, a("#modal-wechat-webuploader").remove(), 0 == a("#modal-wechat-webuploader").length && a(document.body).append(d.buildHtml().mainDialog), d.modalobj = a("#modal-wechat-webuploader"), d.modalobj.modal("show"), void d.modalobj.on("shown.bs.modal", function() {
				a(this).data("init") || (("image" == d.options.type || "thumb" == d.options.type) && d.initLocal(), "voice" == d.options.type && d.initLocalVoice(), "video" == d.options.type && d.initLocalVideo(), "thumb" == d.options.type || "image" == d.options.type ? d.initImageUploader() : "voice" == d.options.type ? d.initVoiceUploader() : "video" == d.options.type && d.initVideoUploader())
			}))
		},
		initLocal: function() {
			var a = this;
			a.modalobj.find("#li_history_image").removeClass("hide"), a.modalobj.find("#wechat_history_image")[0] || a.modalobj.find(".modal-body").append(this.buildHtml().localDialog), a.localPage(1)
		},
		localPage: function(c) {
			var d = this,
				e = d.options.type,
				f = d.options.mode,
				g = d.modalobj.find("#wechat_history_image");
			return a.getJSON("./index.php?c=utility&a=wechat_file&do=browser", {
				page: c,
				type: e,
				mode: f,
				psize: 32
			}, function(c) {
				c = c.message, g.find(".history-content").html('<i class="fa fa-spinner fa-pulse"></i>'), b.isEmpty(c.items) || (g.data("attachment", c.items), g.find(".history-content").empty(), g.find(".history-content").html(b.template(d.buildHtml().localDialogLi)(c)), g.find("#image-list-pager").html(c.page), g.find(".pagination a").click(function() {
					d.localPage(a(this).attr("page"))
				}), g.find(".img-list li").click(function(b) {
					d.selectImage(a(b.target).parents("li"))
				}), d.deletefile())
			}), g.find(".btn-primary").unbind("click").click(function() {
				var b = [];
				g.find(".img-item-selected").each(function() {
					b.push(d.modalobj.find("#wechat_history_image").data("attachment")[a(this).attr("attachid")]), a(this).removeClass("img-item-selected")
				}), d.finish(b)
			}), !1
		},
		selectImage: function(b) {
			var c = this;
			a(b).toggleClass("img-item-selected"), c.options.direct && c.modalobj.find("#wechat_history_image").find(".btn-primary").trigger("click")
		},
		initLocalVoice: function() {
			var a = this;
			a.modalobj.find("#li_history_audio").removeClass("hide"), a.modalobj.find("#wechat_history_audio")[0] || a.modalobj.find(".modal-body").append(this.buildHtml().localAudioDialog);
			a.modalobj.find("#li_history_audio");
			a.localAudioPage(1)
		},
		localAudioPage: function(c) {
			var d = this,
				e = d.options.type,
				f = d.options.mode,
				g = d.modalobj.find("#wechat_history_audio");
			return a.getJSON("./index.php?c=utility&a=wechat_file&do=browser", {
				page: c,
				type: e,
				mode: f,
				psize: 5
			}, function(c) {
				c = c.message, g.find(".history-content").html('<i class="fa fa-spinner fa-pulse"></i>'), b.isEmpty(c.items) || (g.data("attachment", c.items), g.find(".history-content").empty(), g.find(".history-content").html(b.template(d.buildHtml().localAudioDialogLi)(c)), g.find("#image-list-pager").html(c.page), g.find(".pagination a").click(function() {
					d.localAudioPage(a(this).attr("page"))
				}), g.find(".js-btn-select").click(function(b) {
					a(b.target).toggleClass("btn-primary"), d.options.direct && d.modalobj.find("#wechat_history_audio").find(".modal-footer .btn-primary").trigger("click")
				}), d.playAudio(), d.deletefile())
			}), g.find(".modal-footer .btn-primary").unbind("click").click(function() {
				var b = [];
				g.find(".history-content .btn-primary").each(function() {
					b.push(d.modalobj.find("#wechat_history_audio").data("attachment")[a(this).attr("attachid")]), a(this).removeClass("btn-primary")
				}), d.finish(b)
			}), !1
		},
		playAudio: function() {
			var b = this,
				c = b.modalobj.find("#wechat_history_audio");
			a(".audio-player-play").click(function() {
				var b = a(this).attr("attach");
				if (b) {
					if (a("#player")[0]) var d = a("#player");
					else {
						var d = a('<div id="player"></div>');
						a(document.body).append(d)
					}
					d.data("control", a(this)), d.jPlayer({
						playing: function() {
							a(this).data("control").find("p").removeClass("fa-play").addClass("fa-stop")
						},
						pause: function(b) {
							a(this).data("control").find("p").removeClass("fa-stop").addClass("fa-play")
						},
						swfPath: "resource/components/jplayer",
						supplied: "mp3,wma,wav,amr",
						solution: "html, flash"
					}), d.jPlayer("setMedia", {
						mp3: a(this).attr("attach")
					}).jPlayer("play"), a(this).find("p").hasClass("fa-stop") ? d.jPlayer("stop") : (c.find(".fa-stop").removeClass("fa-stop").addClass("fa-play"), d.jPlayer("setMedia", {
						mp3: a(this).attr("attach")
					}).jPlayer("play"))
				}
			})
		},
		deletefile: function() {
			var b = this;
			b.modalobj.find(".history .delete-file").off("click"), b.modalobj.find(".history .delete-file").on("click", function(b) {
				var c = a(this);
				if (confirm("确定要删除文件吗？")) {
					var d = a(this).parent().attr("attachid"),
						e = a(this).parent().attr("data-type");
					a.post("./index.php?c=utility&a=wechat_file&do=delete", {
						id: d
					}, function(b) {
						var b = a.parseJSON(b);
						return b.error ? void("image" == e ? c.parent().remove() : "audio" == e && c.parents("tr").remove()) : (util.message(b.message), !1)
					})
				}
				b.stopPropagation()
			})
		},
		initLocalVideo: function() {
			var a = this;
			a.modalobj.find("#li_history_video").removeClass("hide"), a.modalobj.find("#wechat_history_video")[0] || a.modalobj.find(".modal-body").append(this.buildHtml().localVideoDialog);
			a.modalobj.find("#li_history_video");
			a.localVideoPage(1)
		},
		localVideoPage: function(c) {
			var d = this,
				e = d.options.type,
				f = d.modalobj.find("#wechat_history_video");
			return a.getJSON("./index.php?c=utility&a=wechat_file&do=browser", {
				page: c,
				type: e,
				psize: 5
			}, function(c) {
				c = c.message, f.find(".history-content").html('<i class="fa fa-spinner fa-pulse"></i>'), b.isEmpty(c.items) || (f.data("attachment", c.items), f.find(".history-content").empty(), f.find(".history-content").html(b.template(d.buildHtml().localVideoDialogLi)(c)), f.find("#image-list-pager").html(c.page), f.find(".pagination a").click(function() {
					d.localVideoPage(a(this).attr("page"))
				}), f.find(".js-btn-select").click(function(b) {
					a(b.target).toggleClass("btn-primary"), d.options.direct && d.modalobj.find("#wechat_history_video").find(".modal-footer .btn-primary").trigger("click")
				}), d.deletefile())
			}), f.find(".modal-footer .btn-primary").unbind("click").click(function() {
				var b = [];
				f.find(".history-content .btn-primary").each(function() {
					b.push(d.modalobj.find("#wechat_history_video").data("attachment")[a(this).attr("attachid")]), a(this).removeClass("btn-primary")
				}), d.finish(b)
			}), !1
		},
		initImageUploader: function() {
			function b(b) {
				var c = a('<li id="' + b.id + '"><p class="title">' + b.name + '</p><p class="imgWrap"></p></li>'),
					e = a('<div class="file-panel"><span class="cancel">删除</span></div>').appendTo(c),
					f = c.find("p.progress span"),
					g = c.find("p.imgWrap"),
					h = a('<p class="error"></p>'),
					j = function(a) {
						switch (a) {
							case "exceed_size":
								text = "文件大小超出";
								break;
							case "interrupt":
								text = "上传暂停";
								break;
							default:
								text = "上传失败，请重试"
						}
						h.text(text).appendTo(c)
					};
				"invalid" === b.getStatus() ? j(b.statusText) : (g.text("预览中"), d.makeThumb(b, function(b, c) {
					if (b) return void g.text("不能预览");
					var d = a('<img src="' + c + '">');
					g.empty().append(d)
				}, thumbnailWidth, thumbnailHeight), percentages[b.id] = [b.size, 0], b.rotation = 0), b.on("statuschange", function(a, d) {
					"progress" === d ? f.hide().width(0) : "queued" === d && (c.off("mouseenter mouseleave"), e.remove()), "error" === a || "invalid" === a ? (j(b.statusText), percentages[b.id][1] = 1) : "interrupt" === a ? j("interrupt") : "queued" === a ? percentages[b.id][1] = 0 : "progress" === a && (h.remove(), f.css("display", "block")), c.removeClass("state-" + d).addClass("state-" + a)
				}), c.on("mouseenter", function() {
					e.stop().animate({
						height: 30
					})
				}), c.on("mouseleave", function() {
					e.stop().animate({
						height: 0
					})
				}), e.on("click", "span", function() {
					var c, e = a(this).index();
					switch (e) {
						case 0:
							return void d.removeFile(b);
						case 1:
							b.rotation += 90;
							break;
						case 2:
							b.rotation -= 90
					}
					supportTransition ? (c = "rotate(" + b.rotation + "deg)", g.css({
						"-webkit-transform": c,
						"-mos-transform": c,
						"-o-transform": c,
						transform: c
					})) : g.css("filter", "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + ~~(b.rotation / 90 % 4 + 4) % 4 + ")")
				}), i.options.multiple && k.find(".fileinput-button").show(), c.insertBefore(k.find(".fileinput-button"))
			}

			function e(b) {
				var c = a("#" + b.id);
				delete percentages[b.id], f(), c.off().find(".file-panel").off().end().remove()
			}

			function f() {
				var b, c = 0,
					d = 0,
					e = p.children();
				a.each(percentages, function(a, b) {
					d += b[0], c += b[0] * b[1]
				}), b = d ? c / d : 0, e.eq(0).text(Math.round(100 * b) + "%"), e.eq(1).css("width", Math.round(100 * b) + "%"), g()
			}

			function g() {
				var a, b = "";
				if ("ready" === state) {
					if ("" == i.options.mode) var e = i.modalobj.find(".nav-pills li.active").attr("data-mode");
					else var e = i.options.mode;
					i.options.flag || (d.option("server", d.option("server") + "&mode=" + e + "&types=" + i.options.type), i.options.flag = 1), b = "选中" + fileCount + "张图片，共" + c.formatSize(fileSize) + "。"
				} else "confirm" === state ? (a = d.getStats(), a.uploadFailNum && (b = "已上传" + a.successNum + "张图片," + a.uploadFailNum + '张图片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>')) : (a = d.getStats(), b = "共" + fileCount + "张（" + c.formatSize(fileSize) + "），已上传" + a.successNum + "张", a.uploadFailNum && (b += "，失败" + a.uploadFailNum + "张"));
				m.html(b)
			}

			function h(a) {
				var b;
				if (a !== state) {
					switch (n.removeClass("state-" + state), n.addClass("state-" + a), state = a, state) {
						case "pedding":
							o.removeClass("element-invisible"), k.hide(), d.refresh();
							break;
						case "ready":
							o.addClass("element-invisible"), k.show(), d.refresh();
							break;
						case "uploading":
							p.show(), n.text("暂停上传");
							break;
						case "paused":
							p.show(), n.text("继续上传");
							break;
						case "confirm":
							if (p.hide(), n.text("开始上传").addClass("disabled"), b = d.getStats(), b.successNum && !b.uploadFailNum) return void h("finish");
							break;
						case "finish":
							if (n.removeClass("disabled"), b = d.getStats(), b.successNum) {
								if (d.uploadedFiles.length > 0) return i.finish(d.uploadedFiles), void d.resetUploader()
							} else state = "done", location.reload()
					}
					g()
				}
			}
			var i = this;
			i.options.flag = 0, i.modalobj.find("#li_upload_perm a").html("上传永久图片"), i.modalobj.find("#li_upload_temp a").html("上传临时图片(保留3天)"), i.modalobj.find(".modal-body").append(this.buildHtml().uploaderDialog);
			var j = a("#wechat_uploader"),
				k = a('<ul class="filelist"><li class="fileinput-button js-add-image" id="wechat_filePicker2" style="display:none;"> <a href="javascript:;" class="fileinput-button-icon">+</a></li></ul>').appendTo(j.find(".queueList")),
				l = j.find(".statusBar"),
				m = l.find(".info"),
				n = j.find(".uploadBtn"),
				o = j.find(".placeholder"),
				p = l.find(".progress").hide();
			j.find(".btn-primary");
			fileCount = 0, fileSize = 0, ratio = window.devicePixelRatio || 1, thumbnailWidth = 110 * ratio, thumbnailHeight = 110 * ratio, state = "pedding", percentages = {}, supportTransition = function() {
				var a = document.createElement("p").style,
					b = "transition" in a || "WebkitTransition" in a || "MozTransition" in a || "msTransition" in a || "OTransition" in a;
				return a = null, b
			}(), d;
			var q = {
				pick: {
					id: "#wechat_filePicker",
					label: "点击选择图片",
					multiple: !0
				},
				dnd: "#wechat_dndArea",
				paste: "#wechat_uploader",
				swf: "../addons/feng_fightgroups/web/resource/componets/webuploader/Uploader.swf",
				server: "./index.php?c=utility&a=wechat_file&do=upload",
				chunked: !1,
				compress: {
					quality: 80,
					preserveHeaders: !0,
					noCompressIfLarger: !0,
					compressSize: 1048576
				},
				accept: {
					title: "Images",
					extensions: "gif,jpg,jpeg,bmp,png",
					mimeTypes: "image/*"
				},
				fileNumLimit: 30,
				fileSizeLimit: 4194304,
				fileSingleSizeLimit: 125829120,
				auto: !1
			};
			q = a.extend({}, q, i.options.uploader), q.pick.multiple = i.options.multiple, d = c.create(q), d.uploadedFiles = [], d.addButton({
				id: "#wechat_filePicker2",
				label: "+",
				multiple: i.options.multiple
			}), accept = 0, d.resetUploader = function() {
				fileCount = 0, fileSize = 0, accept = 0, d.uploadedFiles = [], a.each(d.getFiles(), function(a, b) {
					e(b)
				}), f(), d.reset(), d.refresh(), a("#wechat_dndArea").removeClass("element-invisible"), a("#wechat_uploader").find(".filelist").empty(), a("#wechat_filePicker").find(".webuploader-pick").next().css({
					left: "190px"
				});
				var b = a("#wechat_uploader").find(".statusBar");
				b.find(".info").empty(), b.find(".accept").empty(), b.hide()
			}, d.onUploadProgress = function(b, c) {
				var d = a("#" + b.id),
					e = d.find(".progress span");
				e.css("width", 100 * c + "%"), percentages[b.id][1] = c, fileid = b.id, f()
			}, d.onFileQueued = function(a) {
				fileCount++, fileSize += a.size, 1 === fileCount && (o.addClass("element-invisible"), l.show()), b(a), h("ready"), f()
			}, d.onFileDequeued = function(a) {
				fileCount--, fileSize -= a.size, fileCount || h("pedding"), e(a), f()
			}, d.on("all", function(a) {
				switch (a) {
					case "uploadFinished":
						h("confirm");
						break;
					case "startUpload":
						h("uploading");
						break;
					case "stopUpload":
						h("paused")
				}
			}), d.on("uploadSuccess", function(b, c) {
				return c.media_id ? (accept++, d.uploadedFiles.push(c), a("#" + b.id).append('<span class="success" style="line-height: 50px;">' + c.width + "x" + c.height + "</span>"), a(".accept").text("成功上传 " + accept + " 张图片"), void 0) : (alert(c.message), !1)
			}), d.onError = function(a) {
				return "Q_EXCEED_SIZE_LIMIT" == a ? void alert("错误信息: 图片大于 1M 无法上传.") : "F_DUPLICATE" == a ? void alert("错误信息: 不能重复上传图片.") : void alert("Eroor: " + a)
			}, n.on("click", function() {
				return a(this).hasClass("disabled") ? !1 : void("ready" === state ? d.upload() : "paused" === state ? d.upload() : "uploading" === state && d.stop())
			}), m.on("click", ".retry", function() {
				d.retry()
			}), m.on("click", ".ignore", function() {}), n.addClass("state-" + state), f()
		},
		initVoiceUploader: function() {
			function b(b) {
				var e = a('<li id="' + b.id + '"><p class="title" style="top:40px;">' + b.name + '</p><p class="imgWrap" style="top:30px;"></p></li>'),
					f = a('<div class="file-panel"><span class="cancel">删除</span></div>').appendTo(e),
					g = e.find("p.progress span"),
					h = e.find("p.imgWrap"),
					j = a('<p class="error"></p>'),
					l = function(a) {
						switch (a) {
							case "exceed_size":
								text = "文件大小超出";
								break;
							case "interrupt":
								text = "上传暂停";
								break;
							default:
								text = "上传失败，请重试"
						}
						j.text(text).appendTo(e)
					};
				"invalid" === b.getStatus() ? l(b.statusText) : (h.text(c.formatSize(b.size) + " kb"), percentages[b.id] = [b.size, 0], b.rotation = 0), b.on("statuschange", function(a, c) {
					"progress" === c ? g.hide().width(0) : "queued" === c && (e.off("mouseenter mouseleave"), f.remove()), "error" === a || "invalid" === a ? (l(b.statusText), percentages[b.id][1] = 1) : "interrupt" === a ? l("interrupt") : "queued" === a ? percentages[b.id][1] = 0 : "progress" === a && j.remove(), e.removeClass("state-" + c).addClass("state-" + a)
				}), e.on("mouseenter", function() {
					f.stop().animate({
						height: 30
					})
				}), e.on("mouseleave", function() {
					f.stop().animate({
						height: 0
					})
				}), f.on("click", "span", function() {
					var c, e = a(this).index();
					switch (e) {
						case 0:
							return void d.removeFile(b);
						case 1:
							b.rotation += 90;
							break;
						case 2:
							b.rotation -= 90
					}
					supportTransition ? (c = "rotate(" + b.rotation + "deg)", h.css({
						"-webkit-transform": c,
						"-mos-transform": c,
						"-o-transform": c,
						transform: c
					})) : h.css("filter", "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + ~~(b.rotation / 90 % 4 + 4) % 4 + ")")
				}), i.options.multiple && k.find(".fileinput-button").show(), e.insertBefore(k.find(".fileinput-button"))
			}

			function e(b) {
				var c = a("#" + b.id);
				delete percentages[b.id], f(), c.off().find(".file-panel").off().end().remove()
			}

			function f() {
				var b, c = 0,
					d = 0,
					e = p.children();
				a.each(percentages, function(a, b) {
					d += b[0], c += b[0] * b[1]
				}), b = d ? c / d : 0, e.eq(0).text(Math.round(100 * b) + "%"), e.eq(1).css("width", Math.round(100 * b) + "%"), g()
			}

			function g() {
				var a, b = "";
				if ("ready" === state) {
					if ("" == i.options.mode) var e = i.modalobj.find(".nav-pills li.active").attr("data-mode");
					else var e = i.options.mode;
					i.options.flag || (d.option("server", d.option("server") + "&mode=" + e + "&types=" + i.options.type), i.options.flag = 1), b = "选中" + fileCount + "个音频，共" + c.formatSize(fileSize) + "。"
				} else "confirm" === state ? (a = d.getStats(), a.uploadFailNum && (b = "已上传" + a.successNum + "个音频," + a.uploadFailNum + '个音频上传失败，<a class="retry" href="#">重新上传</a>失败音频文件或<a class="ignore" href="#">忽略</a>')) : (a = d.getStats(), b = "共" + fileCount + "张（" + c.formatSize(fileSize) + "），已上传" + a.successNum + "个", a.uploadFailNum && (b += "，失败" + a.uploadFailNum + "个"));
				m.html(b)
			}

			function h(a) {
				var b;
				if (a !== state) {
					switch (n.removeClass("state-" + state), n.addClass("state-" + a), state = a, state) {
						case "pedding":
							o.removeClass("element-invisible"), k.hide(), d.refresh();
							break;
						case "ready":
							o.addClass("element-invisible"), k.show(), d.refresh();
							break;
						case "uploading":
							p.show(), n.text("暂停上传");
							break;
						case "paused":
							p.show(), n.text("继续上传");
							break;
						case "confirm":
							if (p.hide(), n.text("开始上传").addClass("disabled"), b = d.getStats(), b.successNum && !b.uploadFailNum) return void h("finish");
							break;
						case "finish":
							if (n.removeClass("disabled"), b = d.getStats(), b.successNum) {
								if (d.uploadedFiles.length > 0) return i.finish(d.uploadedFiles), void d.resetUploader()
							} else state = "done", location.reload()
					}
					g()
				}
			}
			var i = this;
			i.modalobj.find("#li_upload_perm a").html("上传永久音频"), i.modalobj.find("#li_upload_temp a").html("上传临时音频(保留3天)"), i.modalobj.find(".modal-body").append(this.buildHtml().uploaderDialog);
			var j = a("#wechat_uploader"),
				k = a('<ul class="filelist"><li class="fileinput-button js-add-image" id="wechat_filePicker2" style="display:none;"> <a href="javascript:;" class="fileinput-button-icon">+</a></li></ul>').appendTo(j.find(".queueList")),
				l = j.find(".statusBar"),
				m = l.find(".info"),
				n = j.find(".uploadBtn"),
				o = j.find(".placeholder"),
				p = l.find(".progress").hide();
			j.find(".btn-primary");
			fileCount = 0, fileSize = 0, ratio = window.devicePixelRatio || 1, state = "pedding", percentages = {}, supportTransition = function() {
				var a = document.createElement("p").style,
					b = "transition" in a || "WebkitTransition" in a || "MozTransition" in a || "msTransition" in a || "OTransition" in a;
				return a = null, b
			}(), d;
			var q = {
				pick: {
					id: "#wechat_filePicker",
					label: "点击选择音频",
					multiple: !0
				},
				dnd: "#wechat_dndArea",
				paste: "#wechat_uploader",
				swf: "../addons/feng_fightgroups/web/resource/componets/webuploader/Uploader.swf",
				server: "./index.php?c=utility&a=wechat_file&do=upload",
				chunked: !1,
				compress: {
					quality: 80,
					preserveHeaders: !0,
					noCompressIfLarger: !0,
					compressSize: 1048576
				},
				accept: {
					title: "Audios",
					extensions: "mp3,wma,wav,amr",
					mimeTypes: "audio/*"
				},
				fileNumLimit: 5,
				fileSizeLimit: 5242880,
				fileSingleSizeLimit: 26214400,
				auto: !1
			};
			q = a.extend({}, q, i.options.uploader), a("#wechat_dndArea p").html("临时语音只支持amr/mp3格式,大小不超过为2M<br>永久语音只支持mp3/wma/wav/amr格式,大小不超过为5M,长度不超过60秒"), q.pick.multiple = i.options.multiple, d = c.create(q), d.uploadedFiles = [], d.addButton({
				id: "#wechat_filePicker2",
				label: "+",
				multiple: i.options.multiple
			}), accept = 0, d.resetUploader = function() {
				fileCount = 0, fileSize = 0, accept = 0, d.uploadedFiles = [], a.each(d.getFiles(), function(a, b) {
					e(b)
				}), f(), d.reset(), d.refresh(), a("#wechat_dndArea").removeClass("element-invisible"), a("#wechat_uploader").find(".filelist").empty(), a("#wechat_filePicker").find(".webuploader-pick").next().css({
					left: "190px"
				});
				var b = a("#wechat_uploader").find(".statusBar");
				b.find(".info").empty(), b.find(".accept").empty(), b.hide()
			}, d.onUploadProgress = function(b, c) {
				var d = a("#" + b.id),
					e = d.find(".progress span");
				e.css("width", 100 * c + "%"), percentages[b.id][1] = c, fileid = b.id, f()
			}, d.onFileQueued = function(a) {
				fileCount++, fileSize += a.size, 1 === fileCount && (o.addClass("element-invisible"), l.show()), b(a), h("ready"), f()
			}, d.onFileDequeued = function(a) {
				fileCount--, fileSize -= a.size, fileCount || h("pedding"), e(a), f()
			}, d.on("all", function(a) {
				switch (a) {
					case "uploadFinished":
						h("confirm");
						break;
					case "startUpload":
						h("uploading");
						break;
					case "stopUpload":
						h("paused")
				}
			}), d.on("uploadSuccess", function(b, c) {
				c.media_id && (accept++, d.uploadedFiles.push(c), a("#" + b.id).append('<span class="success" style="line-height: 50px;">' + c.width + "x" + c.height + "</span>"), a(".accept").text("成功上传 " + accept + " 个音频"))
			}), d.onError = function(a) {
				return "Q_EXCEED_SIZE_LIMIT" == a ? void alert("错误信息: 音频大于 " + c.formatSize(q.fileSizeLimit) + " 无法上传.") : "F_DUPLICATE" == a ? void alert("错误信息: 不能重复上传音频.") : void alert("Eroor: " + a)
			}, n.on("click", function() {
				return a(this).hasClass("disabled") ? !1 : void("ready" === state ? d.upload() : "paused" === state ? d.upload() : "uploading" === state && d.stop())
			}), m.on("click", ".retry", function() {
				d.retry()
			}), m.on("click", ".ignore", function() {}), n.addClass("state-" + state), f()
		},
		finish: function(b) {
			var c = this;
			a.isFunction(c.options.callback) && (0 == c.options.multiple ? c.options.callback(b[0]) : c.options.callback(b), c.modalobj.modal("hide"))
		},
		initVideoUploader: function() {
			var b = this;
			b.modalobj.find("#li_upload_perm a").html("上传永久视频"), b.modalobj.find("#li_upload_temp a").html("上传临时视频(保留3天)"), b.modalobj.find(".modal-body").append(this.buildHtml().uploaderVoiceDialog), b.modalobj.find("#fileUploader_video_form").find(':file[name="file"]').filestyle({
				buttonText: "选择视频文件"
			}), b.modalobj.find("#video").find("button.btn-primary").off("click"), b.modalobj.find("#video").find("button.btn-primary").on("click", function() {
				var c = "./index.php?c=utility&a=wechat_file&do=upload&types=video",
					d = b.modalobj.find(".nav-pills li.active").attr("data-mode");
				if (a("#fileUploader_video_form").attr("action", c + "&mode=" + d), !a('#fileUploader_video_form :text[name="title"]').val()) return util.message("视频标题不能为空"), !1;
				if (!a('#fileUploader_video_form textarea[name="introduction"]').val()) return util.message("视频描述不能为空"), !1;
				a("#fileUploader_video_form").submit(), util.loading();
				var e = setInterval(function() {
					var c = a("#fileUploader_video_target").get(0).contentWindow.document.body.innerText;
					if ("" != c) {
						clearInterval(e);
						var d = a.parseJSON(c);
						d.message ? (alert(d.message), util.loaded()) : d.media_id && a.isFunction(b.options.callback) && (b.options.multiple ? b.options.callback([d]) : b.options.callback(d), util.loaded(), b.modalobj.modal("hide"))
					}
				}, 500)
			})
		},
		buildHtml: function() {
			var a = {};
			return a.mainDialog = '<div id="modal-wechat-webuploader" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">\n	<div class="modal-dialog" style="width:660px;">\n		<div class="modal-content">\n			<div class="modal-header">\n				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n				<ul class="nav nav-pills" role="tablist">\n					<li id="li_upload_perm" data-mode="perm" class="active" role="presentation"><a href="#wechat_upload" aria-controls="wechat_upload" role="tab" data-toggle="tab">上传</a></li>\n					<li id="li_upload_temp" data-mode="temp" role="presentation"><a href="#wechat_upload" aria-controls="wechat_upload" role="tab" data-toggle="tab">上传</a></li>\n					<li id="li_history_image" class="hide" role="presentation"><a href="#wechat_history_image" aria-controls="wechat_history_image" role="tab" data-toggle="tab">浏览图片</a></li>\n					<li id="li_history_audio" class="hide" role="presentation"><a href="#wechat_history_audio" aria-controls="wechat_history_audio" role="tab" data-toggle="tab">浏览音频</a></li>\n					<li id="li_history_video" class="hide" role="presentation"><a href="#wechat_history_video" aria-controls="wechat_history_video" role="tab" data-toggle="tab">浏览视频</a></li>\n				</ul>\n			</div>\n			<div class="modal-body tab-content"></div>\n		</div>\n	</div>\n</div>', a.localDialog = '<div role="tabpanel" class="tab-pane history" id="wechat_history_image">\n	<div class="history-content" style="height:310px"></div>\n	<div class="modal-footer">\n		<div style="float: left;">\n			<nav id="image-list-pager">\n				<ul class="pager" style="margin: 0;"></ul>\n			</nav>\n		</div>\n		<div style="float: right;">\n		<button ' + (this.options.multiple ? "" : 'style="display:none;"') + ' type="button" class="btn btn-primary">确认</button>\n' + (this.options.multiple ? '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\n' : "") + "		</div>\n	</div>\n</div>", a.uploaderDialog = '<div role="tabpanel" class="tab-pane upload active" id="wechat_upload">\n	<div id="wechat_uploader" class="uploader">\n		<div class="queueList">\n			<div id="wechat_dndArea" class="placeholder">\n				<div id="wechat_filePicker">xx</div>\n' + (this.options.multiple ? '<p id="">或将照片拖到这里，单次最多可选5张</p>\n' : '<p id="">或将照片拖到这里</p>\n') + '			</div>\n		</div>\n		<div class="statusBar">\n			<div class="infowrap">\n				<div class="progress">\n					<span class="text">0%</span>\n					<span class="percentage"></span>\n				</div>\n				<div class="info"></div>\n				<div class="accept"></div>\n			</div>\n			<div class="btns">\n				<div class="uploadBtn btn btn-primary" style="margin-top: 4px;">确定使用</div>\n				<div class="modal-button-upload" style="float: right; margin-left: 5px;">\n					<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>', a.localDialogLi = '<ul class="img-list clearfix">\n<%_.each(items, function(item) {%> \n<li class="img-item" attachid="<%=item.id%>" data-type="image" title="<%=item.filename%>">\n	<div class="btnClose delete-file"><a href="javascript:;"><i class="fa fa-times"></i></a></div>	<div class="img-container" style="background-image: url(\'<%=item.url%>\');">\n		<div class="select-status"><span></span></div>\n	</div>\n</li>\n<%});%>\n</ul>', a.localAudioDialog = '<div role="tabpanel" class="tab-pane history" id="wechat_history_audio">\n	<div style="height:310px">\n		<table class="table table-hover">\n		<thead class="navbar-inner">\n			<tr>\n				<th>标题</th>\n				<th style="width:30%;text-align:right">创建时间</th>\n				<th style="width:30%;text-align:right">\n					<div class="input-group input-group-sm hide">\n						<input type="text" class="form-control">\n						<span class="input-group-btn">\n							<button class="btn btn-default" type="button"><i class="fa fa-search" style="font-size:12px; margin-top:0;"></i></button>\n						</span>\n					</div>\n				</th>\n			</tr>\n		</thead>\n		<tbody class="history-content">\n		</tbody>\n	</table></div>\n	<div class="modal-footer">\n		<div style="float: left;">\n			<nav id="image-list-pager">\n				<ul class="pager" style="margin: 0;"></ul>\n			</nav>\n		</div>\n		<div style="float: right;">\n		<button ' + (this.options.multiple ? "" : 'style="display:none;"') + ' type="button" class="btn btn-primary">确认</button>\n' + (this.options.multiple ? '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\n' : "") + "		</div>\n	</div>\n</div>", a.localAudioDialogLi = '<%var items = _.sortBy(items, function(item) {return -item.id;});%><%_.each(items, function(item) {%> \n<tr>\n	<td><a href="<%=item.url%>" target="blank" title="<%=item.filename%>"><%=item.filename%></a></td>\n	<td class="text-right"><%=item.createtime%></td>\n	<td class="text-right">\n		<span class="input-group-btn" attachid="<%=item.id%>" data-type="audio">\n			<button class="btn btn-default audio-player-play" type="button" attach="<%=item.url%>"><p style="margin:0px;" class="fa fa-play"></p></button>\n			<button class="btn btn-default delete-file">删除</button>\n			<button attachid="<%=item.id%>" class="btn btn-default js-btn-select">选取</button>\n		</span>\n	</td>\n</tr>\n<%});%>\n', a.localVideoDialog = '<div role="tabpanel" class="tab-pane history" id="wechat_history_video">\n	<div style="height:310px">\n		<table class="table table-hover">\n		<thead class="navbar-inner">\n			<tr>\n				<th>标题</th>\n				<th style="width:30%;text-align:right">创建时间</th>\n				<th style="width:30%;text-align:right">\n					<div class="input-group input-group-sm hide">\n						<input type="text" class="form-control">\n						<span class="input-group-btn">\n							<button class="btn btn-default" type="button"><i class="fa fa-search" style="font-size:12px; margin-top:0;"></i></button>\n						</span>\n					</div>\n				</th>\n			</tr>\n		</thead>\n		<tbody class="history-content">\n		</tbody>\n	</table></div>\n	<div class="modal-footer">\n		<div style="float: left;">\n			<nav id="image-list-pager">\n				<ul class="pager" style="margin: 0;"></ul>\n			</nav>\n		</div>\n		<div style="float: right;">\n		<button ' + (this.options.multiple ? "" : 'style="display:none;"') + ' type="button" class="btn btn-primary">确认</button>\n' + (this.options.multiple ? '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\n' : "") + "		</div>\n	</div>\n</div>", a.localVideoDialogLi = '<%var items = _.sortBy(items, function(item) {return -item.id;});%><%_.each(items, function(item) {%> \n<tr>\n	<td><a href="<%=item.url%>" target="blank" title="<%=item.filename%>"><%=item.filename%></a></td>\n	<td class="text-right"><%=item.createtime%></td>\n	<td class="text-right">\n		<span class="input-group-btn" attachid="<%=item.id%>" data-type="audio">\n			<button class="btn btn-default delete-file">删除</button>\n			<button attachid="<%=item.id%>" class="btn btn-default js-btn-select">选取</button>\n		</span>\n	</td>\n</tr>\n<%});%>\n', a.uploaderVoiceDialog = '<div role="tabpanel" class="tab-pane upload active" id="wechat_upload">\n		<iframe width="0" height="0" id="fileUploader_video_target" name="fileUploader_video_target" style="display:none;"></iframe>		<form class="form-horizontal" id="fileUploader_video_form" name="fileUploader_video_form" action="" enctype="multipart/form-data" method="post" target="fileUploader_video_target">			<div class="form-group">				<label class="col-xs-12 col-sm-2 control-label">上传视频</label>				<div class="col-sm-10">					<input type="file" name="file">				</div>			</div>			<div class="form-group">				<label class="col-xs-12 col-sm-2 control-label">视频标题</label>				<div class="col-sm-10">					<input type="text" name="title" class="form-control" placeholder="视频标题">				</div>			</div>			<div class="form-group">				<label class="col-xs-12 col-sm-2 control-label">视频描述</label>				<div class="col-sm-10">					<textarea name="introduction" class="form-control" placeholder="视频描述"></textarea>				</div>			</div>			<div class="form-group">				<div class="col-sm-10 col-sm-offset-2">					<div class="alert alert-warning" role="alert">注 :永久视频只支持rm/rmvb/wmv/avi/mpg/mpeg/mp4格式,大小不超过为20M.<br>注 :临时视频只支持mp4格式,大小不超过为10M</div>				</div>			</div>		</form>	<div class="modal-footer" id="video" style="padding: 12px 0px 0px;">		<div style="float: left;">			<span class="browser-info"><span>		</div>		<div style="float: right;">			<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>			<button type="button" class="btn btn-primary">确认</button>		</div>	</div></div>', a
		}
	};
	return d
});