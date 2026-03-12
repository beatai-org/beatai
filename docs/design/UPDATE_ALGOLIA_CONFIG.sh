#!/bin/bash
# Algolia 配置更新脚本
# 收到 Algolia 凭证后运行此脚本

echo "=========================================="
echo "   Algolia DocSearch 配置更新向导"
echo "=========================================="
echo ""

# 读取用户输入
read -p "请输入 Algolia appId: " APP_ID
read -p "请输入 Algolia apiKey: " API_KEY
read -p "请输入 Algolia indexName: " INDEX_NAME

echo ""
echo "您输入的配置："
echo "  appId: $APP_ID"
echo "  apiKey: $API_KEY"
echo "  indexName: $INDEX_NAME"
echo ""

read -p "确认无误？(y/n) " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "已取消配置"
    exit 1
fi

# 备份原文件
cp src/components/docs/AIAssistant.js src/components/docs/AIAssistant.js.backup
echo "✅ 已备份原文件到 AIAssistant.js.backup"

# 替换配置
sed -i.tmp "s/appId: 'YOUR_APP_ID'/appId: '$APP_ID'/g" src/components/docs/AIAssistant.js
sed -i.tmp "s/apiKey: 'YOUR_SEARCH_API_KEY'/apiKey: '$API_KEY'/g" src/components/docs/AIAssistant.js
sed -i.tmp "s/indexName: 'YOUR_INDEX_NAME'/indexName: '$INDEX_NAME'/g" src/components/docs/AIAssistant.js
sed -i.tmp "s/enabled: false/enabled: true/g" src/components/docs/AIAssistant.js

rm src/components/docs/AIAssistant.js.tmp

echo "✅ 配置已更新"
echo ""
echo "接下来的步骤："
echo "1. 运行 'npm run build' 构建项目"
echo "2. 部署到生产环境"
echo "3. 等待 Algolia 爬取（1-2天）"
echo "4. 测试全文搜索功能"
echo ""
echo "=========================================="
