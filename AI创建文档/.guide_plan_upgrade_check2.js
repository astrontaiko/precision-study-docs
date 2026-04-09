
    (function () {
      var state = {
        scoreTarget: "70-94分",
        stage: "同步提升",
        abilityDirect: "中",
        motivationDirect: "中",
        currentProgress: "第2次课｜语言运用",
        abilityAnswers: [1, 0, 0],
        motivationAnswers: [1, 1, 0]
      };

      var overlay = document.getElementById("plannerOverlay");
      var judgeOverlay = document.getElementById("judgeOverlay");

      function setSingleActive(container, target, selector) {
        var nodes = container.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i += 1) {
          nodes[i].classList.toggle("active", nodes[i] === target);
        }
      }

      function calcLevel(values, high, low) {
        var sum = values.reduce(function (a, b) { return a + b; }, 0);
        if (sum === values.length) return high;
        if (sum === 0) return low;
        return high.replace("高", "中");
      }

      function ability() {
        return "能力" + state.abilityDirect;
      }

      function motivation() {
        return "意愿" + state.motivationDirect;
      }

      function studentSegment() {
        var score = state.scoreTarget;
        var a = ability();
        var m = motivation();
        if (score === "95分以上" && a === "能力高" && m === "意愿高") return "优等生/优潜生";
        if (score === "70分以下") return "后进生";
        if (score === "70-94分" && a !== "能力高" && m === "意愿高") return "努力的中等生";
        if (score === "70-94分" && a === "能力高" && m !== "意愿高") return "意愿不足的中等生";
        if (score === "70-94分" && a !== "能力高" && m !== "意愿高") return "薄弱的中等生";
        return "混合型学生";
      }

      function strategyList() {
        var segment = studentSegment();
        if (segment === "意愿不足的中等生") {
          return [
            "优先安排更容易看到成绩变化的重点内容，先建立正反馈。",
            "已学但掌握不好的内容进入测学，避免无效重复学习。",
            "进阶内容保持适量，确保既能看到变化也不过度增加压力。"
          ];
        }
        if (segment === "后进生") {
          return [
            "优先补前序与基础内容，确保学生先跟上校内主线。",
            "已学内容只对重点部分做测学，降低重复学习负担。",
            "以基础必学为主，进阶内容延后处理。"
          ];
        }
        return [
          "优先学习重点基础内容，确保同步校内节奏。",
          "已学但掌握不好的内容进入测学，避免重复铺开学习。",
          "进阶内容作为选学，保障学生既能跟上校内，又能看到提升空间。"
        ];
      }

      function homeworkStrategyList() {
        if (state.stage === "超前预习") {
          return [
            "课后自动生成基础巩固作业，帮助学生完成预习后的即时消化。",
            "作业优先包含当天重点知识的基础练习，避免预习内容遗忘。",
            "章节学完后自动安排章节复习任务。"
          ];
        }
        return [
          "课后自动生成日常作业，承接当天同步提升内容。",
          "作业优先包含近期错题，帮助学生及时回流巩固。",
          "章节学完后自动安排章节复习任务。"
        ];
      }

      function resultLevel(values, high, low) {
        return calcLevel(values, high, low).replace("能力", "").replace("意愿", "");
      }

      function isReady() {
        if (!state.scoreTarget || !state.abilityDirect || !state.motivationDirect || !state.stage) return false;
        if (state.stage === "同步提升" && !state.currentProgress) return false;
        return true;
      }

      function renderPreview() {
        document.getElementById("previewReady").style.display = isReady() ? "flex" : "none";
        document.getElementById("previewEmpty").style.display = isReady() ? "none" : "block";
        document.getElementById("abilityResult").textContent = "当前结果：能力" + resultLevel(state.abilityAnswers, "能力高", "能力低");
        document.getElementById("motivationResult").textContent = "当前结果：意愿" + resultLevel(state.motivationAnswers, "意愿高", "意愿低");
        if (!isReady()) return;

        document.getElementById("portraitTags").innerHTML = [
          state.scoreTarget,
          ability(),
          motivation(),
          state.stage
        ].map(function (item) {
          return '<span class="pill-item">' + item + '</span>';
        }).join("");

        document.getElementById("previewLearningStrategy").innerHTML = strategyList().map(function (item, index) {
          return '<div class="path-item"><strong>策略 ' + (index + 1) + '</strong><span>' + item + '</span></div>';
        }).join("");

        document.getElementById("previewHomeworkStrategy").innerHTML = homeworkStrategyList().map(function (item, index) {
          return '<div class="path-item"><strong>策略 ' + (index + 1) + '</strong><span>' + item + '</span></div>';
        }).join("");
      }

      function renderSummary() {
        document.getElementById("planProgressText").textContent = state.stage === "同步提升" ? "按校内进度生成" : "超前预习生成";
        document.getElementById("learningRules").innerHTML = isReady() ? strategyList().map(function (item, index) {
          return '<div class="stack-item"><strong>策略 ' + (index + 1) + '</strong><span>' + item + '</span></div>';
        }).join("") : '<div class="stack-item"><strong>待生成</strong><span>请先完成学习成绩、能力、意愿和学习阶段选择。</span></div>';

        document.getElementById("homeworkRules").innerHTML = isReady() ? homeworkStrategyList().map(function (item, index) {
          return '<div class="stack-item"><strong>策略 ' + (index + 1) + '</strong><span>' + item + '</span></div>';
        }).join("") : '<div class="stack-item"><strong>待生成</strong><span>请先完成学习成绩、能力、意愿和学习阶段选择。</span></div>';
      }

      document.addEventListener("click", function (event) {
        if (event.target.id === "openPlanner") overlay.classList.remove("hidden");
        if (event.target.id === "closePlanner" || event.target === overlay) overlay.classList.add("hidden");
        if (event.target.id === "openJudge") judgeOverlay.classList.remove("hidden");
        if (event.target.id === "closeJudge" || event.target === judgeOverlay) judgeOverlay.classList.add("hidden");

        var scoreBtn = event.target.closest("[data-score]");
        if (scoreBtn) {
          state.scoreTarget = scoreBtn.getAttribute("data-score");
          setSingleActive(document.getElementById("scoreChoices"), scoreBtn, ".choice-btn");
          renderPreview();
          renderSummary();
        }

        var abilityBtn = event.target.closest("#abilityDirect [data-ability]");
        if (abilityBtn) {
          state.abilityDirect = abilityBtn.getAttribute("data-ability");
          setSingleActive(document.getElementById("abilityDirect"), abilityBtn, ".tag-btn");
          renderPreview();
          renderSummary();
        }

        var motivationBtn = event.target.closest("#motivationDirect [data-motivation]");
        if (motivationBtn) {
          state.motivationDirect = motivationBtn.getAttribute("data-motivation");
          setSingleActive(document.getElementById("motivationDirect"), motivationBtn, ".tag-btn");
          renderPreview();
          renderSummary();
        }

        var toggleBtn = event.target.closest(".question .toggle-btn");
        if (toggleBtn) {
          var row = toggleBtn.parentNode;
          var group = row.getAttribute("data-group");
          setSingleActive(row, toggleBtn, ".toggle-btn");
          var value = Number(toggleBtn.getAttribute("data-value"));
          if (group.indexOf("ability") === 0) state.abilityAnswers[Number(group.slice(-1)) - 1] = value;
          if (group.indexOf("motivation") === 0) state.motivationAnswers[Number(group.slice(-1)) - 1] = value;
          renderPreview();
          renderSummary();
        }

        if (event.target.id === "confirmJudge") {
          state.abilityDirect = resultLevel(state.abilityAnswers, "能力高", "能力低");
          state.motivationDirect = resultLevel(state.motivationAnswers, "意愿高", "意愿低");
          setSingleActive(document.getElementById("abilityDirect"), document.querySelector('#abilityDirect [data-ability="' + state.abilityDirect + '"]'), ".tag-btn");
          setSingleActive(document.getElementById("motivationDirect"), document.querySelector('#motivationDirect [data-motivation="' + state.motivationDirect + '"]'), ".tag-btn");
          judgeOverlay.classList.add("hidden");
          renderPreview();
          renderSummary();
        }

        if (event.target.id === "createPlan") {
          overlay.classList.add("hidden");
          document.getElementById("planStatus").textContent = "规划已更新";
          renderSummary();
        }
      });

      document.getElementById("studyStage").addEventListener("change", function (event) {
        state.stage = event.target.value;
        document.getElementById("progressField").style.display = state.stage === "同步提升" ? "block" : "none";
        document.getElementById("submitNote").textContent = "系统将根据当前学生标签，生成一份" + state.stage + "的个性化规划。";
        renderPreview();
        renderSummary();
      });
      document.getElementById("currentProgress").addEventListener("change", function (event) {
        state.currentProgress = event.target.value;
        renderPreview();
        renderSummary();
      });

      document.getElementById("progressField").style.display = state.stage === "同步提升" ? "block" : "none";
      renderPreview();
      renderSummary();
    }());
  