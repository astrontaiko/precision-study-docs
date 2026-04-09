from PIL import Image, ImageDraw, ImageFont


WIDTH = 2200
PADDING_X = 90
TOP = 80
BOTTOM = 80
COLORS = {
    "bg": "#f4f8ff",
    "title": "#1f2f5a",
    "text": "#32496f",
    "muted": "#6d82a6",
    "line": "#9ab8ff",
    "node_fill": "#ffffff",
    "node_border": "#c8d8ff",
    "accent_fill": "#eef4ff",
    "accent_border": "#92b1ff",
}


def load_font(size, bold=False):
    candidates = [
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/STHeiti Light.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size, index=0)
        except Exception:
            continue
    return ImageFont.load_default()


FONT_TITLE = load_font(44, bold=True)
FONT_SECTION = load_font(30, bold=True)
FONT_BODY = load_font(24)
FONT_SMALL = load_font(21)


def wrap_text(draw, text, font, max_width):
    lines = []
    for paragraph in text.split("\n"):
        if not paragraph:
            lines.append("")
            continue
        current = ""
        for ch in paragraph:
            candidate = current + ch
            bbox = draw.textbbox((0, 0), candidate, font=font)
            if bbox[2] - bbox[0] <= max_width or not current:
                current = candidate
            else:
                lines.append(current)
                current = ch
        if current:
            lines.append(current)
    return lines


def draw_multiline(draw, xy, text, font, fill, max_width, line_gap=10):
    lines = wrap_text(draw, text, font, max_width)
    x, y = xy
    for line in lines:
        draw.text((x, y), line, font=font, fill=fill)
        bbox = draw.textbbox((x, y), line or " ", font=font)
        y += (bbox[3] - bbox[1]) + line_gap
    return y


def draw_box(draw, x, y, w, title, body, fill, border):
    radius = 28
    draw.rounded_rectangle((x, y, x + w, y + 180), radius=radius, fill=fill, outline=border, width=3)
    draw.text((x + 28, y + 20), title, font=FONT_SECTION, fill=COLORS["title"])
    draw_multiline(draw, (x + 28, y + 68), body, FONT_BODY, COLORS["text"], w - 56, line_gap=8)
    return (x + w / 2, y + 180)


def arrow(draw, start, end):
    x1, y1 = start
    x2, y2 = end
    draw.line((x1, y1, x2, y2), fill=COLORS["line"], width=6)
    ah = 18
    aw = 10
    draw.polygon([(x2, y2), (x2 - aw, y2 - ah), (x2 + aw, y2 - ah)], fill=COLORS["line"])


title = "个性化学习内容生成流程图（推荐系统逻辑）"
subtitle = "按“召回 → 粗排 → 精排 → 重排组装 → 结果回流”生成最终学习内容"

sections = [
    ("输入信息层", "基础信息：年级 / 学科 / 教材 / 时期 / 校内进度 / 升学目标\n学生画像：成绩 / 能力 / 意愿 / 老师直选标签 / 辅助判断\n动态学情：试卷分析 / 错题 / 正确率 / 掌握度 / 专注度 / 历史完成情况\n教师意图：重点内容 / 不学内容 / 临时需求 / 智教助手指令"),
    ("召回层", "从全量内容池召回候选学习内容：\n1. 教材主线召回\n2. 升学目标召回\n3. 薄弱点召回\n4. 历史承接召回\n5. 高频题模召回\n6. 教师指定召回"),
    ("粗排层", "快速筛掉不适合当前阶段的内容：\n- 是否匹配教材、学期、校内进度\n- 是否与老师“不学”冲突\n- 难度是否适配学生当前能力\n- 是否属于高分值主线或当前薄弱点\n输出：必学 / 可学 / 延后 / 不学"),
    ("精排层", "对候选内容打优先级分：\n分值贡献 × 薄弱程度 × 前置依赖 × 阶段匹配度 × 教师意图 × 完成可行性\n决定：先学什么、后学什么、哪些放主干、哪些做分支"),
    ("重排与组装层", "把排序结果变成老师可执行的内容：\n- 控量：控制单阶段、单次课负荷\n- 去重：避免画像页和规划页重复\n- 结构化：章 / 节 / 元 / 模\n- 打标：主干 / 分支 / 已布置作业 / 不学"),
    ("页面输出层", "学生画像页：解释学生状态、推荐体系、说明为什么这样规划\n阶段规划页：只讲这一阶段学什么、顺序、时长\n列表地图 / 知识图谱：展示当前阶段内容结构\n训练场：沉淀作业、试卷、专项任务"),
    ("结果回流层", "训练完成情况、试卷分析、掌握度变化、行为与专注变化回流系统\n进入下一轮召回与排序更新，实现持续迭代的个性化学习规划"),
]

img = Image.new("RGB", (WIDTH, 2700), COLORS["bg"])
draw = ImageDraw.Draw(img)

draw.text((PADDING_X, TOP), title, font=FONT_TITLE, fill=COLORS["title"])
draw.text((PADDING_X, TOP + 70), subtitle, font=FONT_BODY, fill=COLORS["muted"])

box_width = WIDTH - PADDING_X * 2
y = TOP + 150
centers = []

for idx, (sec_title, sec_body) in enumerate(sections):
    fill = COLORS["accent_fill"] if idx in (1, 3, 5) else COLORS["node_fill"]
    border = COLORS["accent_border"] if idx in (1, 3, 5) else COLORS["node_border"]
    center = draw_box(draw, PADDING_X, y, box_width, sec_title, sec_body, fill, border)
    centers.append(center)
    y += 240

for i in range(len(centers) - 1):
    start = centers[i]
    end = (centers[i + 1][0], centers[i + 1][1] - 60)
    arrow(draw, start, end)

legend_y = y + 10
draw.rounded_rectangle((PADDING_X, legend_y, WIDTH - PADDING_X, legend_y + 120), radius=24, fill="#ffffff", outline=COLORS["node_border"], width=2)
draw.text((PADDING_X + 28, legend_y + 20), "核心逻辑", font=FONT_SECTION, fill=COLORS["title"])
draw_multiline(
    draw,
    (PADDING_X + 180, legend_y + 24),
    "信息先决定召回范围，再决定筛选和排序，最后组装成学生画像、阶段规划、地图和训练场；学习结果再反向影响下一轮内容生成。",
    FONT_BODY,
    COLORS["text"],
    WIDTH - PADDING_X * 2 - 220,
    line_gap=8,
)

output_path = "/Users/mac/Desktop/精准学说明文档-md/AI创建文档/学习内容生成流程图-推荐系统逻辑.png"
img.save(output_path, format="PNG")
print(output_path)
