#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step() {
    echo -e "${BLUE}🔹 $1${NC}"
}

# 显示帮助信息
show_help() {
    cat << EOF
${CYAN}GitHub Pages 部署工具${NC}

用法:
  bash scripts/deploy-gh-pages.sh [选项]

选项:
  -h, --help          显示此帮助信息
  -s, --skip-build    跳过构建步骤（使用现有 build 目录）
  -t, --test          仅构建和测试，不部署
  -v, --verbose       显示详细输出

描述:
  此脚本自动化 GitHub Pages 部署流程：
  1. 检查 git 状态
  2. 构建生产版本
  3. 部署到 gh-pages 分支
  4. 验证部署结果

示例:
  bash scripts/deploy-gh-pages.sh              # 完整部署流程
  bash scripts/deploy-gh-pages.sh -s           # 跳过构建，直接部署
  bash scripts/deploy-gh-pages.sh -t           # 仅构建和测试
  bash scripts/deploy-gh-pages.sh -v           # 显示详细输出

EOF
}

# 默认选项
SKIP_BUILD=false
TEST_ONLY=false
VERBOSE=false

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -s|--skip-build)
            SKIP_BUILD=true
            shift
            ;;
        -t|--test)
            TEST_ONLY=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        *)
            print_error "未知选项: $1"
            echo "使用 -h 或 --help 查看帮助信息"
            exit 1
            ;;
    esac
done

# 获取脚本所在目录的父目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT" || exit 1

# 开始部署流程
echo ""
print_info "🚀 GitHub Pages 部署工具"
echo ""

# 步骤 1: 检查 git 状态
print_step "步骤 1/5: 检查 Git 状态"
if [ "$VERBOSE" = true ]; then
    git status
fi

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
    print_warning "检测到未提交的更改"
    echo ""
    git status --short
    echo ""
    read -p "是否继续部署？(y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "部署已取消"
        exit 1
    fi
fi

print_success "Git 状态检查完成"
echo ""

# 步骤 2: 构建生产版本
if [ "$SKIP_BUILD" = false ]; then
    print_step "步骤 2/5: 构建生产版本"
    print_info "运行: npm run build"
    echo ""

    if [ "$VERBOSE" = true ]; then
        npm run build
    else
        npm run build > /tmp/deploy-build.log 2>&1
    fi

    BUILD_EXIT_CODE=$?

    if [ $BUILD_EXIT_CODE -ne 0 ]; then
        print_error "构建失败！"
        if [ "$VERBOSE" = false ]; then
            echo ""
            print_info "显示构建日志："
            tail -30 /tmp/deploy-build.log
        fi
        exit 1
    fi

    print_success "构建完成"
    echo ""
else
    print_warning "跳过构建步骤（使用现有 build 目录）"
    echo ""

    if [ ! -d "build" ]; then
        print_error "build 目录不存在！请先运行构建或移除 -s 选项"
        exit 1
    fi
fi

# 步骤 3: 检查构建结果
print_step "步骤 3/5: 检查构建结果"

# 检查关键文件
CRITICAL_FILES=(
    "build/index.html"
    "build/CNAME"
    "build/static/js"
    "build/static/css"
    "build/docs"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -e "$file" ]; then
        print_error "关键文件/目录缺失: $file"
        exit 1
    fi
done

# 显示构建统计
BUILD_SIZE=$(du -sh build | cut -f1)
FILE_COUNT=$(find build -type f | wc -l | tr -d ' ')

print_info "构建目录大小: $BUILD_SIZE"
print_info "文件总数: $FILE_COUNT"

# 检查 CNAME 内容
CNAME_CONTENT=$(cat build/CNAME 2>/dev/null)
if [ -n "$CNAME_CONTENT" ]; then
    print_info "自定义域名: $CNAME_CONTENT"
fi

print_success "构建结果检查通过"
echo ""

# 如果是测试模式，到此结束
if [ "$TEST_ONLY" = true ]; then
    print_success "🎉 测试模式：构建和检查完成"
    echo ""
    print_info "如需部署，请移除 -t 选项"
    exit 0
fi

# 步骤 4: 部署到 gh-pages
print_step "步骤 4/5: 部署到 gh-pages 分支"
print_info "运行: npm run deploy"
echo ""

if [ "$VERBOSE" = true ]; then
    npm run deploy
else
    npm run deploy > /tmp/deploy-gh-pages.log 2>&1
fi

DEPLOY_EXIT_CODE=$?

if [ $DEPLOY_EXIT_CODE -ne 0 ]; then
    print_error "部署失败！"
    if [ "$VERBOSE" = false ]; then
        echo ""
        print_info "显示部署日志："
        tail -30 /tmp/deploy-gh-pages.log
    fi
    exit 1
fi

print_success "部署完成"
echo ""

# 步骤 5: 显示部署信息
print_step "步骤 5/5: 部署信息"

# 读取 package.json 获取 homepage
HOMEPAGE=$(node -pe "require('./package.json').homepage" 2>/dev/null)

# 获取 git 远程仓库信息
REMOTE_URL=$(git config --get remote.origin.url 2>/dev/null)
if [ -n "$REMOTE_URL" ]; then
    # 提取仓库名称
    REPO_NAME=$(echo "$REMOTE_URL" | sed -E 's/.*[:/]([^/]+\/[^/]+)(\.git)?$/\1/' | sed 's/\.git$//')
    print_info "仓库: $REPO_NAME"
fi

if [ -n "$HOMEPAGE" ]; then
    print_info "主页: $HOMEPAGE"
fi

# 获取当前提交信息
CURRENT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null)
if [ -n "$CURRENT_COMMIT" ]; then
    print_info "提交: $CURRENT_COMMIT"
fi

echo ""
print_success "🎉 部署成功！"
echo ""

# 显示访问链接
if [ -n "$CNAME_CONTENT" ]; then
    print_info "🌐 访问地址: https://$CNAME_CONTENT"
else
    if [[ "$HOMEPAGE" == *"github.io"* ]]; then
        print_info "🌐 访问地址: $HOMEPAGE"
    fi
fi

echo ""
print_info "📝 注意事项："
echo "   • GitHub Pages 可能需要几分钟时间更新"
echo "   • 首次部署可能需要 10 分钟左右"
echo "   • 检查部署状态: https://github.com/$REPO_NAME/actions"
echo ""

# 询问是否打开浏览器
if command -v open &> /dev/null; then
    read -p "是否在浏览器中打开网站？(y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -n "$CNAME_CONTENT" ]; then
            open "https://$CNAME_CONTENT"
        elif [ -n "$HOMEPAGE" ]; then
            open "$HOMEPAGE"
        fi
    fi
fi

print_success "部署流程完成！"
