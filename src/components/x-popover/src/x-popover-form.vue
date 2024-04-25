<template>
    <el-popover 
        ref="popoverForm"
        :popper-class="popperClass"
        :trigger="dialogVue.trigger"
        :open-delay="0"
        :close-delay="0"
        :width="dialogVue.width"
        :placement="dialogVue.placement"
        @after-leave="dialogVue.closed"
    >
        <div class="x-popover__container" v-clickoutside:[dialogVue.notClickOutside]="dialogVue.cancelDialogShow">
            <div class="x-popover__body" :style="dialogVue.bodySize">
                <scroll :parent="dialogVue">
                    <slot name="pre-custom"></slot>
                    <el-form :model="dialogVue.modalData" :label-position="dialogVue.labelPosition" :label-width="dialogVue.labelWidth" ref="modalDataForm" @submit.native.prevent class="kz-form">
                        <slot></slot>
                    </el-form>
                    <slot name="custom"></slot>
                </scroll>
            </div>
            <template v-if="dialogVue.hasFooterSlot">
                <div class="x-popover__footer">
                    <slot name="footer">
                        <el-button :size="dialogVue.footerButtonSize" type="primary" @click="dialogVue.handleConfirmSet()" :loading="dialogVue.pvt_isloading">确定</el-button>
                        <el-button :size="dialogVue.footerButtonSize"  @click="dialogVue.cancelDialogShow()">取消</el-button>
                    </slot>
                </div>
            </template>
        </div>
    </el-popover>
</template>

<script>
const scroll = {
    render(h) {
        if (this.parent.hasScrollbar) {
            return h('el-scrollbar', {
                props: {
                    scrollbarClass: this.parent.bodySize.height ? 'scrollbar--specific' : ''
                }
            }, this.$slots.default);
        } else {
            return h('div', {
                class: 'x-popover__body--noscroll'
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
            dialogVue: this.parent || this.$parent
        };
    },
    computed: {
        popperClass() {
            let custom = this.dialogVue['popper-class'];
            custom += ' x-popover ';
            custom += this.dialogVue.notClickOutside;
            if (!this.dialogVue.hasFooterSlot) {
                custom += ' no-footer-slot';
            }
            return custom;
        }
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
        clearValidate() {
            this.$refs.modalDataForm && this.$refs.modalDataForm.clearValidate();
        },
        closePopover() {
            let pop = this.$refs.popoverForm;
            if (pop) {
                pop.doClose();
            }
        },
        // 更新
        openPopover() {
            this.$nextTick(() => {
                let pop = this.$refs.popoverForm;
                console.log(pop, 'pop');
                pop.referenceElm = pop.$refs.reference = this.dialogVue.event.currentTarget || this.dialogVue.event.target;
                pop.doShow();
            });
        }
    }
};
</script>
