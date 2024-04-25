/*
 * @Description  : 弹出框混合
 * @Author       : XH
 * @Date         : 2021-06-11 18:00:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-24 11:07:12
 */

import _ from 'lodash';
import { xPopoverForm } from '@/components/x-popover';
export default {
    components: { xPopoverForm },
    props: {
        // 是否显示
        visible: {
            type: Boolean,
            default: false
        },
        event: {
            default: () => ({})
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
            // [Popover弹框配置]
            'width': 450, // 最小宽度
            'offset': 0, // 出现位置的偏移量
            'placement': 'bottom', // 出现位置
            'popper-class': 'kz-popover',
            'hasScrollbar': true, // 是否有滚动条
            'labelPosition': 'right', // 对齐方式
            'labelWidth': '120px', // 表单的label
            'hasFooterSlot': true, // 是否有底部插槽
            'footerButtonSize': 'small', // 底部按钮尺寸
            'bodySize': {
                width: 'initial'
            },
            // 表单相关
            'modalData': {}, // 表单数据
            'modalConfig': {}, // 配置传参

            // 内部参数
            'defaultModalData': {}, // 记录初始表单数据
            'defaultModalConfig': {}, // 配置传参
            'pvt_visible': false, // 先请求数据再决定是否渲染
            'pvt_isloading': false// 是否在加载中  提交按钮
        };
    },
    computed: {
        notClickOutside() { // 共同class防止点击弹窗异常消失
            return this.$vnode.tag;
        }
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
                console.warn("kz-popover-form 需添加 ref='modalDataDialog'");
            }
            this.$refs.modalDataDialog && this.$refs.modalDataDialog.validate((valid) => {
                if (valid) {
                    this.pvt_isloading = true;
                    this.confirmSet();
                    this.pvt_isloading = false;
                }
            });
        },
        closed() {
            this.beforeClosedDialog();
            this.pvt_visible = false; // 动画结束才是真正的关闭   防止频繁打开关闭位置异常
            // 还需要做数据的重置
            if (this.visible) {// 需要再次打开新的
                this.$nextTick(async() => {
                    await this._vilidateVisible();
                });
            }
            this.$refs.modalDataDialog && this.$refs.modalDataDialog.resetFields();
        },
        // 由于会出现连续打开popover  上一个popover还存在  故不只是在visible出验证数据
        async _vilidateVisible() {
            this.modalData = _.merge({}, this.defaultModalData, this.data);
            this.modalConfig = _.merge({}, this.defaultModalConfig, this.config);
            let res = await this.beforeOpenDialog();
            if (res) {
                if (!this.pvt_visible) { // 已经关闭了   不在动画中
                    this.pvt_visible = true;
                }
            } else {
                this.cancelDialogShow();
            }
        }
    },
    watch: {
        async visible(val) {
            if (val) {
                if (this.pvt_visible) {return;}
                await this._vilidateVisible();
            } else {
                this.$refs.modalDataDialog.closePopover(); // 先执行动画再关闭
            }
        },
        pvt_visible(val) {
            if (val) {
                this.$refs.modalDataDialog.openPopover();
            }
        }
    }
};
