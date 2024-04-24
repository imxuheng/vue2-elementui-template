<template>
    <el-dialog 
        :visible="dialogVue.pvt_visible" 
        :custom-class="customClass" 
        :title="dialogVue.title + dialogVue.titleInfo" 
        :width="sizeConfig.w" 
        :height="sizeConfig.h" 
        :modal-append-to-body="false" 
        :close-on-click-modal="false" 
        :dragDialog="true" 
        :append-to-body="dialogVue.appendToBody" 
        footer-border 
        :fullscreen="dialogVue.hasFullScreen" 
        @opened="dialogVue.beforeOpenedDialog()" 
        @close="dialogVue.cancelDialogShow()" 
        @closed="dialogVue.closed()"
    >
        <scroll :parent="dialogVue">
            <div v-if="$slots.comment" class="kz-dialog__comment">
                <el-alert type="info" :closable="false" show-icon>
                    <template slot="title">
                        <slot name="comment"></slot>
                    </template>
                </el-alert>
            </div>
            <el-form
                @submit.native.prevent
                ref="modalDataForm"
                class="kz-form"
                :model="dialogVue.modalData"
                :label-position='dialogVue.labelPosition'
                :label-width="dialogVue.labelWidth">
                <slot></slot>
            </el-form>
            <slot name="custom"></slot>
        </scroll>

        <template v-if="dialogVue.hasFooterSlot">
            <div slot="footer">
                <slot name="footer">
                    <el-button type="primary" @click="dialogVue.handleConfirmSet()">确定</el-button>
                    <el-button  @click="dialogVue.cancelDialogShow()">取消</el-button>
                </slot>
            </div>
        </template>
    </el-dialog>
</template>

<script>
const SIZE_ENUM = {
    mini: {
        w: '560px',
        h: '320px'
    },
    small: {
        w: '560px',
        h: '400px'
    },
    medium: {
        w: '560px',
        h: '560px'
    },
    large: {
        w: '560px',
        h: '680px'
    },
    custom: {
        // 自定义宽高
        w: '560px',
        h: '680px'
    }
};
const scroll = {
    render(h) {
        if (this.parent.hasScrollbar) {
            return h('el-scrollbar', {
                props: {
                    scrollbarClass: 'scrollbar--specific'
                }
            }, this.$slots.default);
        } else {
            return h('div', {
                class: 'el-dialog__body--noscroll'
            }, this.$slots.default);
        }
    },
    props: {
        parent: {
            type: Object
        }
    }
};
export default {
    components: {
        scroll
    },
    props: {
        // 指定父组件的 this
        parent: {
            type: Object
        }
    },
    data() {
        return {
            dialogVue: this.parent || this.$parent,
            sizeConfig: {},

            // 对话框大小枚举
            SIZE_ENUM
        };
    },
    computed: {
        customClass() {
            let custom = this.dialogVue['custom-class'];
            if (!this.dialogVue.hasFooterSlot) {
                custom += ' no-footer-slot';
            }
            if (this.dialogVue.hastablePadding) {
                custom += ' has-table-padding';
            }
            return custom;
        }
    },
    created() {
        this.sizeConfig = this.dialogVue.size == 'custom' ? this.dialogVue.sizeCustom : SIZE_ENUM[this.dialogVue.size];
    },
    methods: {
        // 验证
        validate(callback) {
            this.$refs.modalDataForm &&
            this.$refs.modalDataForm.validate((valid) => {
                callback(valid);
            });
        },
        // 重置
        resetFields() {
            this.$refs.modalDataForm && this.$refs.modalDataForm.resetFields();
        },
        clearValidate(props) {
            this.$refs.modalDataForm && this.$refs.modalDataForm.clearValidate(props);
        }
    }
};
</script>
