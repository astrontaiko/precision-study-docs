
    (function () {
      var strategies = [
        { name: "高中数学-人教版A版-S类-预习配课策略", subject: "高中数学", version: "人教版A版", student: "S", scene: "预习", count: 2, used: 37, status: "启用" },
        { name: "高中数学-人教版A版-S类-提升配课策略", subject: "高中数学", version: "人教版A版", student: "S", scene: "提升", count: 2, used: 27, status: "启用" },
        { name: "高中数学-人教版A版-A类-预习配课策略", subject: "高中数学", version: "人教版A版", student: "A", scene: "预习", count: 1, used: 19, status: "启用" },
        { name: "高中数学-人教版A版-B类-提升配课策略", subject: "高中数学", version: "人教版A版", student: "B", scene: "提升", count: 1, used: 5, status: "草稿" },
        { name: "语文-部编版-S类-预习配课策略", subject: "语文", version: "部编版", student: "S", scene: "预习", count: 3, used: 13, status: "启用" }
      ];

      var state = {
        currentStrategy: strategies[0],
        chapterCount: 1,
        requiredRules: [
          { title: "必学规则 1", questionType: "学", difficulty: ["基础"], examType: "章节", examRate: "高", importance: ["中", "高"], learned: "不区分", passMode: "学", planType: "新知学" },
          { title: "必学规则 2", questionType: "学", difficulty: ["进阶"], examType: "请选择", examRate: "请选择", importance: ["高"], learned: "不区分", passMode: "学", planType: "新知学" }
        ],
        optionalRules: []
      };

      var listPage = document.getElementById("listPage");
      var editorPage = document.getElementById("editorPage");
      var strategyTable = document.getElementById("strategyTable");

      function renderTable() {
        var subject = document.getElementById("filterSubject").value;
        var version = document.getElementById("filterVersion").value;
        var student = document.getElementById("filterStudent").value;
        var scene = document.getElementById("filterScene").value;

        var rows = strategies.filter(function (item) {
          return (!subject || item.subject === subject) &&
            (!version || item.version === version) &&
            (!student || item.student === student) &&
            (!scene || item.scene === scene);
        });

        document.getElementById("totalCount").textContent = rows.length;
        strategyTable.innerHTML = rows.map(function (item, index) {
          return '<tr>' +
            '<td>' + item.name + '</td>' +
            '<td>' + item.subject + '</td>' +
            '<td>' + item.version + '</td>' +
            '<td><span class="tag">' + item.student + '</span></td>' +
            '<td>' + item.scene + '</td>' +
            '<td>' + item.count + '</td>' +
            '<td><span class="status-pill">' + item.status + '</span></td>' +
            '<td>' + item.used + '</td>' +
            '<td><a data-action="edit" data-index="' + index + '">编辑</a><a data-action="copy" data-index="' + index + '">复制</a></td>' +
            '</tr>';
        }).join("");
      }

      function ruleCard(rule, group, index) {
        return '<div class="rule-card" data-group="' + group + '" data-index="' + index + '">' +
          '<div class="rule-head">' +
            '<strong>' + rule.title + '</strong>' +
            '<span class="tag">顺序 ' + (index + 1) + '</span>' +
          '</div>' +
          '<div class="rule-grid">' +
            '<div class="field"><label><span class="required">*</span> 题模类型</label><select class="select" data-field="questionType"><option' + (rule.questionType === '学' ? ' selected' : '') + '>学</option><option' + (rule.questionType === '练' ? ' selected' : '') + '>练</option><option' + (rule.questionType === '试' ? ' selected' : '') + '>试</option><option' + (rule.questionType === '融会贯通' ? ' selected' : '') + '>融会贯通</option></select></div>' +
            '<div class="field"><label><span class="required">*</span> 认知难度</label><div class="tag-box">' + rule.difficulty.map(function (tag) { return '<span class="tag">' + tag + '</span>'; }).join('') + '</div></div>' +
            '<div class="field"><label>考频类型</label><select class="select" data-field="examType"><option' + (rule.examType === '请选择' ? ' selected' : '') + '>请选择</option><option' + (rule.examType === '章节' ? ' selected' : '') + '>章节</option><option' + (rule.examType === '期中' ? ' selected' : '') + '>期中</option><option' + (rule.examType === '期末' ? ' selected' : '') + '>期末</option></select></div>' +
            '<div class="field"><label>考频</label><select class="select" data-field="examRate"><option' + (rule.examRate === '请选择' ? ' selected' : '') + '>请选择</option><option' + (rule.examRate === '高' ? ' selected' : '') + '>高</option><option' + (rule.examRate === '中' ? ' selected' : '') + '>中</option><option' + (rule.examRate === '低' ? ' selected' : '') + '>低</option></select></div>' +
            '<div class="field"><label>重要度</label><div class="tag-box">' + rule.importance.map(function (tag) { return '<span class="tag">' + tag + '</span>'; }).join('') + '</div></div>' +
            '<div class="field"><label><span class="required">*</span> 是否已学</label><select class="select" data-field="learned"><option' + (rule.learned === '不区分' ? ' selected' : '') + '>不区分</option><option' + (rule.learned === '已学' ? ' selected' : '') + '>已学</option><option' + (rule.learned === '未学' ? ' selected' : '') + '>未学</option></select></div>' +
            '<div class="field"><label><span class="required">*</span> 通关方式</label><select class="select" data-field="passMode"><option' + (rule.passMode === '学' ? ' selected' : '') + '>学</option><option' + (rule.passMode === '测已学' ? ' selected' : '') + '>测已学</option><option' + (rule.passMode === '测前序' ? ' selected' : '') + '>测前序</option><option' + (rule.passMode === '先测后补' ? ' selected' : '') + '>先测后补</option></select></div>' +
            '<div class="field"><label><span class="required">*</span> 学习方案类型</label><select class="select" data-field="planType"><option' + (rule.planType === '新知学' ? ' selected' : '') + '>新知学</option><option' + (rule.planType === '巩固学' ? ' selected' : '') + '>巩固学</option><option' + (rule.planType === '复习学' ? ' selected' : '') + '>复习学</option></select></div>' +
          '</div>' +
          '<div class="hint">规则说明：系统将按当前顺序依次筛选匹配的题模范围，并决定对应的学习方式和学习方案。</div>' +
          '<div class="rule-actions">' +
            '<button class="link-btn" data-op="delete">删除</button>' +
            '<button class="link-btn" data-op="copy">复制</button>' +
            '<button class="link-btn" data-op="up">上移</button>' +
            '<button class="link-btn" data-op="down">下移</button>' +
          '</div>' +
        '</div>';
      }

      function renderEditor() {
        document.getElementById("editorTitle").textContent = state.currentStrategy.name;
        document.getElementById("metaSubject").textContent = state.currentStrategy.subject;
        document.getElementById("metaVersion").textContent = state.currentStrategy.version;
        document.getElementById("metaStudent").textContent = state.currentStrategy.student;
        document.getElementById("metaScene").textContent = state.currentStrategy.scene;

        var tabs = [];
        for (var i = 1; i <= state.chapterCount; i += 1) {
          tabs.push('<button class="tab-btn' + (i === 1 ? ' active' : '') + '">章节策略 ' + i + '</button>');
        }
        document.getElementById("chapterTabs").innerHTML = tabs.join('');

        document.getElementById("requiredRules").innerHTML = state.requiredRules.map(function (rule, index) {
          return ruleCard(rule, 'required', index);
        }).join('');

        document.getElementById("optionalRules").innerHTML = state.optionalRules.length
          ? state.optionalRules.map(function (rule, index) { return ruleCard(rule, 'optional', index); }).join('')
          : '<div class="stack-item"><strong>当前未配置选学规则</strong><span>如需在学生有余力时推荐额外内容，可新增一条选学规则。</span></div>';

        renderAside();
      }

      function renderAside() {
        document.getElementById("asideStudent").textContent = state.currentStrategy.student + '类';
        document.getElementById("asideScene").textContent = state.currentStrategy.scene;
        document.getElementById("asideRequiredCount").textContent = state.requiredRules.length + ' 条';
        document.getElementById("asideOptionalCount").textContent = state.optionalRules.length + ' 条';

        document.getElementById("ruleSummary").innerHTML =
          '<div class="stack-item"><strong>必学内容</strong><span>当前共配置 ' + state.requiredRules.length + ' 条规则，优先影响学生必学内容的输出范围和学习方式。</span></div>' +
          '<div class="stack-item"><strong>选学内容</strong><span>' + (state.optionalRules.length ? '当前已配置 ' + state.optionalRules.length + ' 条选学规则，用于有余力时继续推荐内容。' : '当前未配置选学规则，系统不会输出选学内容。') + '</span></div>';
      }

      function openEditor(strategy) {
        state.currentStrategy = JSON.parse(JSON.stringify(strategy));
        listPage.classList.remove('active');
        editorPage.classList.add('active');
        document.getElementById('validationBox').classList.remove('show');
        renderEditor();
      }

      function backToList() {
        editorPage.classList.remove('active');
        listPage.classList.add('active');
        renderTable();
      }

      function createEmptyRule(title) {
        return { title: title, questionType: '学', difficulty: ['基础'], examType: '请选择', examRate: '请选择', importance: ['高'], learned: '不区分', passMode: '学', planType: '新知学' };
      }

      function validateBeforeSave() {
        var errors = [];
        if (!state.requiredRules.length) errors.push('请至少配置一条必学规则。');

        function checkRule(rule, index, group) {
          if (!rule.questionType) errors.push(group + '第' + (index + 1) + '条规则缺少题模类型。');
          if (!rule.difficulty || !rule.difficulty.length) errors.push(group + '第' + (index + 1) + '条规则缺少认知难度。');
          if (!rule.learned) errors.push(group + '第' + (index + 1) + '条规则缺少是否已学。');
          if (!rule.passMode) errors.push(group + '第' + (index + 1) + '条规则缺少通关方式。');
          if (!rule.planType) errors.push(group + '第' + (index + 1) + '条规则缺少学习方案类型。');
        }

        state.requiredRules.forEach(function (rule, index) { checkRule(rule, index, '必学'); });
        state.optionalRules.forEach(function (rule, index) { checkRule(rule, index, '选学'); });

        return errors;
      }

      document.addEventListener('click', function (event) {
        var action = event.target.getAttribute('data-action');
        var index = event.target.getAttribute('data-index');

        if (action === 'edit') {
          openEditor(strategies[Number(index)]);
        }

        if (action === 'copy') {
          var copied = JSON.parse(JSON.stringify(strategies[Number(index)]));
          copied.name += '-副本';
          copied.status = '草稿';
          strategies.unshift(copied);
          renderTable();
        }

        if (event.target.id === 'addStrategy') {
          state.currentStrategy = {
            name: '新建配课策略',
            subject: document.getElementById('filterSubject').value || '高中数学',
            version: document.getElementById('filterVersion').value || '人教版A版',
            student: document.getElementById('filterStudent').value || 'S',
            scene: document.getElementById('filterScene').value || '预习'
          };
          state.chapterCount = 1;
          state.requiredRules = [createEmptyRule('必学规则 1')];
          state.optionalRules = [];
          openEditor(state.currentStrategy);
        }

        if (event.target.id === 'addChapterTab') {
          state.chapterCount += 1;
          renderEditor();
        }

        if (event.target.id === 'backToList') {
          backToList();
        }

        if (event.target.id === 'saveStrategy') {
          var errors = validateBeforeSave();
          var box = document.getElementById('validationBox');
          if (errors.length) {
            box.classList.add('show');
            box.innerHTML = errors.join('<br>');
            return;
          }
          box.classList.remove('show');
          backToList();
        }

        if (event.target.classList.contains('add-rule')) {
          var target = event.target.getAttribute('data-target');
          if (target === 'required') state.requiredRules.push(createEmptyRule('必学规则 ' + (state.requiredRules.length + 1)));
          if (target === 'optional') state.optionalRules.push(createEmptyRule('选学规则 ' + (state.optionalRules.length + 1)));
          renderEditor();
        }

        if (event.target.classList.contains('link-btn')) {
          var card = event.target.closest('.rule-card');
          if (!card) return;
          var group = card.getAttribute('data-group');
          var ruleIndex = Number(card.getAttribute('data-index'));
          var list = group === 'required' ? state.requiredRules : state.optionalRules;
          var op = event.target.getAttribute('data-op');

          if (op === 'delete') list.splice(ruleIndex, 1);
          if (op === 'copy') {
            var cloned = JSON.parse(JSON.stringify(list[ruleIndex]));
            cloned.title = cloned.title + '-副本';
            list.splice(ruleIndex + 1, 0, cloned);
          }
          if (op === 'up' && ruleIndex > 0) {
            var tempUp = list[ruleIndex - 1];
            list[ruleIndex - 1] = list[ruleIndex];
            list[ruleIndex] = tempUp;
          }
          if (op === 'down' && ruleIndex < list.length - 1) {
            var tempDown = list[ruleIndex + 1];
            list[ruleIndex + 1] = list[ruleIndex];
            list[ruleIndex] = tempDown;
          }
          renderEditor();
        }
      });

      ['filterSubject', 'filterVersion', 'filterStudent', 'filterScene'].forEach(function (id) {
        document.getElementById(id).addEventListener('change', renderTable);
      });

      document.getElementById('resetFilter').addEventListener('click', function () {
        ['filterSubject', 'filterVersion', 'filterStudent', 'filterScene'].forEach(function (id) {
          document.getElementById(id).value = '';
        });
        renderTable();
      });

      renderTable();
      renderAside();
    }());
  