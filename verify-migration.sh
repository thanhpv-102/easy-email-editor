#!/bin/bash

# Migration Verification Script
# This script checks if the migration from react-final-form to react-hook-form is complete

echo "🔍 Verifying React 19 Migration..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track errors
ERRORS=0

# Check for remaining react-final-form imports
echo "📦 Checking for remaining react-final-form imports..."
FINAL_FORM_IMPORTS=$(grep -r "from 'react-final-form'" packages/*/src 2>/dev/null | wc -l)
if [ "$FINAL_FORM_IMPORTS" -gt 0 ]; then
    echo -e "${RED}❌ Found $FINAL_FORM_IMPORTS react-final-form imports${NC}"
    grep -r "from 'react-final-form'" packages/*/src 2>/dev/null
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No react-final-form imports found${NC}"
fi

# Check for remaining final-form-arrays imports
echo ""
echo "📦 Checking for remaining final-form-arrays imports..."
FINAL_FORM_ARRAYS_IMPORTS=$(grep -r "from 'react-final-form-arrays'" packages/*/src 2>/dev/null | wc -l)
if [ "$FINAL_FORM_ARRAYS_IMPORTS" -gt 0 ]; then
    echo -e "${RED}❌ Found $FINAL_FORM_ARRAYS_IMPORTS react-final-form-arrays imports${NC}"
    grep -r "from 'react-final-form-arrays'" packages/*/src 2>/dev/null
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ No react-final-form-arrays imports found${NC}"
fi

# Check if formBridge.tsx exists
echo ""
echo "📄 Checking for form bridge file..."
if [ -f "packages/easy-email-editor/src/utils/formBridge.tsx" ]; then
    echo -e "${GREEN}✅ Form bridge file exists${NC}"
else
    echo -e "${RED}❌ Form bridge file not found${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check if formBridge is exported from index
echo ""
echo "📤 Checking if form bridge is exported..."
if grep -q "export \* from './utils/formBridge'" packages/easy-email-editor/src/index.tsx 2>/dev/null; then
    echo -e "${GREEN}✅ Form bridge is exported${NC}"
else
    echo -e "${RED}❌ Form bridge is not exported${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Check package.json dependencies
echo ""
echo "📋 Checking package.json files..."

# Check easy-email-editor
if grep -q "react-final-form" packages/easy-email-editor/package.json 2>/dev/null; then
    echo -e "${RED}❌ easy-email-editor still has react-final-form in package.json${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ easy-email-editor package.json is clean${NC}"
fi

if grep -q "react-hook-form" packages/easy-email-editor/package.json 2>/dev/null; then
    echo -e "${GREEN}✅ easy-email-editor has react-hook-form${NC}"
else
    echo -e "${YELLOW}⚠️  react-hook-form not found in easy-email-editor package.json${NC}"
fi

# Check easy-email-extensions
echo ""
if grep -q "react-final-form" packages/easy-email-extensions/package.json 2>/dev/null; then
    echo -e "${RED}❌ easy-email-extensions still has react-final-form in package.json${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ easy-email-extensions package.json is clean${NC}"
fi

# Check vite configs
echo ""
echo "⚙️  Checking vite configurations..."

if grep -q "react-final-form" packages/easy-email-editor/vite.config.ts 2>/dev/null; then
    echo -e "${RED}❌ easy-email-editor vite config still references react-final-form${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ easy-email-editor vite config is updated${NC}"
fi

if grep -q "react-final-form" packages/easy-email-extensions/vite.config.ts 2>/dev/null; then
    echo -e "${RED}❌ easy-email-extensions vite config still references react-final-form${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ easy-email-extensions vite config is updated${NC}"
fi

# Check for documentation
echo ""
echo "📚 Checking documentation..."

if [ -f "MIGRATION_GUIDE.md" ]; then
    echo -e "${GREEN}✅ Migration guide exists${NC}"
else
    echo -e "${YELLOW}⚠️  Migration guide not found${NC}"
fi

if [ -f "REACT_19_MIGRATION_SUMMARY.md" ]; then
    echo -e "${GREEN}✅ Migration summary exists${NC}"
else
    echo -e "${YELLOW}⚠️  Migration summary not found${NC}"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Migration appears complete.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run: pnpm install"
    echo "  2. Build: cd packages/easy-email-editor && pnpm run build"
    echo "  3. Build: cd packages/easy-email-extensions && pnpm run build"
    echo "  4. Test: cd demo && pnpm run dev"
else
    echo -e "${RED}❌ Found $ERRORS issue(s). Please review above.${NC}"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
