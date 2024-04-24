/*
 * @Description  : 对话框混合
 * @Author       : XH
 * @Date         : 2021-06-10 19:51:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-31 11:23:26
 */

import { xDialogForm } from '@/components/x-dialog';
import _ from 'lodash';

export default {
    components: { xDialogForm },
    props: {
        // 是否显示
        visible: {
            type: Boolean,
            default: false
        },

        // 标题
        title: {
            type: String,
            default: '弹窗'
        },

        // 初始化表单参数
        data: {
            type: Object,
            default: () => ({})
        },

        // 配置传参，非表单数据
        config: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            // 自定义 可选值：[small/medium/large/custom]
            'size': 'medium',
            'sizeCustom': {}, // 当size为custom时的自定义宽高

            // 弹窗配置
            'custom-class': 'x-dialog',
            'appendToBody': true,
            'hasFullScreen': false, // 是否有全屏
            'hasScrollbar': true, // 是否有滚动条
            'labelWidth': '160px', // 表单的label
            'labelPosition': 'right', // 表单域标签的位置
            'hasFooterSlot': true, // 是否有底部插槽
            'hasTablePadding': false, // 表格页弹窗 是否需要table的padding
            'titleInfo': '', // 弹窗后的描述

            // 表单相关
            'modalData': {}, // 表单数据
            'modalConfig': {}, // 配置传参

            // 内部参数
            'defaultModalData': {}, // 记录初始表单数据
            'defaultModalConfig': {}, // 配置传参
            'pvt_visible': false, // 先请求数据再决定是否渲染
            textareaAutoSize: { minRows: 4, maxRows: 8 } // 可自适应文本高度的文本域
        };
    },
    created() {
        this.defaultModalData = _.cloneDeep(this.modalData);
        this.defaultModalConfig = _.cloneDeep(this.modalConfig);
    },
    methods: {

        /**
         * 弹窗打开之前的回调
         *  !!! 说明：  主要针对于请求数据之后再确定是否打开情况
         * @return {boolean}
         */
        beforeOpenDialog() {
            return true;
        },

        /**
         * 弹窗打开动画之后的回调
         * 主要解决 打开时获取弹窗内部的 refs
         */
        beforeOpenedDialog() {
        },

        /**
         * 弹窗关闭动画之后的回调
         */
        beforeClosedDialog() {

        },

        /**
         * 确定的回调事件
         */
        confirmSet() {
            console.log(this.modalData);
        },


        /** *****************       分割线  以下方法不可重写            *************/

        /**
         * 关闭输入框   自动数据重置
         */
        cancelDialogShow() {
            this.$emit('btnCancel');
            this.$emit('update:visible', false);
        },

        /**
         * 触发父组件成功回调
         * @param data
         */
        emitBtnsuccess(data = {}) {
            this.$emit('btnSuccess', data);
        },

        /**
         * 验证正则  确定按钮   无需外部调用
         */
        handleConfirmSet() {
            if (!this.$refs.modalDataDialog) {
                console.warn("x-dialog-form 需添加 ref='modalDataDialog'");
            }
            this.$refs.modalDataDialog && this.$refs.modalDataDialog.validate((valid) => {
                if (valid) {
                    this.confirmSet();
                }
            });
        },
        closed() {
            this.beforeClosedDialog();
            this.clearUploadFiles();
            // 还需要做数据的重置
            this.$refs.modalDataDialog && this.$refs.modalDataDialog.resetFields();
        },
        // 通过refs 判断如果是upload组件  则还原上传组件
        clearUploadFiles() {
            _.forEach(this.$refs, (item) => {
                if (item && item.$options && item.$options.name && item.$options.name == 'x-upload') {
                    item.clearFiles();
                }
            });
        }
    },
    watch: {
        async visible(val) {
            if (val) {
                this.modalData = _.merge({}, this.defaultModalData, this.data);
                this.modalConfig = _.merge({}, this.defaultModalConfig, this.config);
                let res = await this.beforeOpenDialog();
                if (res) {
                    this.pvt_visible = true;
                } else {
                    this.cancelDialogShow();
                }
            } else {
                this.pvt_visible = false;
            }
        }
    }
};

