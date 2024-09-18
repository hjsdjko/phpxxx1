Vue.component('xinwenxinxi-form', {
template:`
<template>
    <div>
        <el-dialog
                :visible.sync="formVisible"
                :title="formTitle"
                v-if="formVisible"
                custom-class="formModel"
                >
            <el-form class="formModel_form" ref="formRef" :model="form" :rules="rules" >
                <el-form-item  label="新闻标题" prop="xinwenbiaoti" class="input-item">
                    <el-input v-model="form.xinwenbiaoti"
                       placeholder="新闻标题"
                       type="text"
                       :readonly="!isAdd||disabledForm.xinwenbiaoti?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="封面" prop="fengmian" v-if="formVisible" class="imgUpload-item">
                    <file-upload
                            :disabled="!isAdd||disabledForm.fengmian?true:false"
                            tip="点击上传封面"
                            action="file/upload"
                            :limit="3"
                            :multiple="true"
                            :file-urls="form.fengmian?form.fengmian:''"
                            @change="fengmianUploadSuccess"
                    ></file-upload>
                </el-form-item>
                <el-form-item label="新闻分类" prop="xinwenfenlei" class="select-item">
                    <el-select
                        :disabled="!isAdd||disabledForm.xinwenfenlei?true:false"
                        v-model="form.xinwenfenlei"
                        placeholder="请选择新闻分类"
                    >
                        <el-option v-for="(item,index) in xinwenfenleiLists" :label="item"
                               :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布日期" prop="faburiqi" class="date-item">
                    <el-date-picker
                            v-model="form.faburiqi"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            type="date"
                            :readonly="!isAdd||disabledForm.faburiqi?true:false"
                            placeholder="请选择发布日期"/>
                </el-form-item>
                <el-form-item v-if="type=='info'" label="收藏数量" prop="storeupnum" class="input-item">
                    <el-input v-model="form.storeupnum"
                       placeholder="收藏数量"
                       type="text"
                       :readonly="!isAdd||disabledForm.storeupnum?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="新闻简介" prop="xinwenjianjie" class="textarea-item">
                    <el-input v-model="form.xinwenjianjie" placeholder="新闻简介"
                              type="textarea"
                              :readonly="!isAdd||disabledForm.xinwenjianjie?true:false"
                    />
                </el-form-item>
                <el-form-item label="新闻内容" prop="xinwenneirong" v-if="formVisible" class="rich-item">
                     <my-editor
                             :value="form.xinwenneirong" placeholder="请输入新闻内容"
                             :readonly="!isAdd||disabledForm.xinwenneirong?true:false"
                             @change="(e)=>editorChange(e,'xinwenneirong')"></my-editor  >
                </el-form-item>
            </el-form>
            <div class="formModel-btns" v-if="isAdd||type=='reply'">
                <el-button class="formModel_cancel" @click="closeClick">取消</el-button>
                <el-button class="formModel_confirm" type="primary" @click="save"
                    >
                    提交
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
`,
data() {
    return {
        formVisible:false,
        formTitle:'',
        id:0,
        form:{},
        type:'',
        formName:'新闻信息',
        rules:{
            xinwenbiaoti: [
                {required: true,message: '请输入',trigger: 'blur'},

            ],
            fengmian: [
            ],
            xinwenfenlei: [
                {required: true,message: '请输入',trigger: 'blur'},

            ],
            xinwenjianjie: [
            ],
            xinwenneirong: [
            ],
            faburiqi: [
            ],
            storeupnum: [
                { validator: toolUtil.fromValidate.number, trigger: 'blur' },
            ],
            thumbsupnum: [
                { validator: toolUtil.fromValidate.number, trigger: 'blur' },
            ],
            crazilynum: [
                { validator: toolUtil.fromValidate.number, trigger: 'blur' },
            ],
        },
        isAdd:false,
        disabledForm:{
            xinwenbiaoti : false,
            fengmian : false,
            xinwenfenlei : false,
            xinwenjianjie : false,
            xinwenneirong : false,
            faburiqi : false,
            storeupnum : false,
            thumbsupnum : false,
            crazilynum : false,
        },
        //新闻分类列表
        xinwenfenleiLists:[],
        crossRow:'',
        crossTips:'',
        crossColumnName:'',
        crossColumnValue:'',
        userInfo:{},
        sessionTable:localStorage.getItem('admin_sessionTable'),
    }
},
watch:{
},
methods: {
    init(formId=null,formType='add',formNames='',row=null,table=null,statusColumnName=null,tips=null,statusColumnValue=null){
        this.resetForm()
                this.form.faburiqi = toolUtil.getCurDate()
        if(formId){
            this.id = formId
            this.type = formType
        }
        if(formType == 'add'){
            this.isAdd = true
            this.formTitle = '新增' + this.formName
            this.formVisible = true
        } else if(formType == 'info'){
            this.isAdd = false
            this.formTitle = '查看' + this.formName
            this.getInfo()
        } else if(formType == 'edit'){
            this.isAdd = true
            this.formTitle = '修改' + this.formName
            this.getInfo()
        } else if(formType == 'reply'){
            this.type = formType
            this.isAdd = true
            this.disabledForm.cpicture = true
            this.disabledForm.content = true
            this.formTitle = '回复'
            this.getInfo()
        } else if(formType == 'cross'){
            this.isAdd = true
            this.formTitle = formNames
            for(let x in row){
                if(x=='xinwenbiaoti'){
                    this.form.xinwenbiaoti = row[x];
                    this.disabledForm.xinwenbiaoti = true;
                    continue;
                }
                if(x=='fengmian'){
                    this.form.fengmian = row[x];
                    this.disabledForm.fengmian = true;
                    continue;
                }
                if(x=='xinwenfenlei'){
                    this.form.xinwenfenlei = row[x];
                    this.disabledForm.xinwenfenlei = true;
                    continue;
                }
                if(x=='xinwenjianjie'){
                    this.form.xinwenjianjie = row[x];
                    this.disabledForm.xinwenjianjie = true;
                    continue;
                }
                if(x=='xinwenneirong'){
                    this.form.xinwenneirong = row[x];
                    this.disabledForm.xinwenneirong = true;
                    continue;
                }
                if(x=='faburiqi'){
                    this.form.faburiqi = row[x];
                    this.disabledForm.faburiqi = true;
                    continue;
                }
                if(x=='storeupnum'){
                    this.form.storeupnum = row[x];
                    this.disabledForm.storeupnum = true;
                    continue;
                }
                if(x=='thumbsupnum'){
                    this.form.thumbsupnum = row[x];
                    this.disabledForm.thumbsupnum = true;
                    continue;
                }
                if(x=='crazilynum'){
                    this.form.crazilynum = row[x];
                    this.disabledForm.crazilynum = true;
                    continue;
                }
            }
            if(row){
                this.crossRow = row
            }
            if(table){
                this.crossTable = table
            }
            if(tips){
                this.crossTips = tips
            }
            if(statusColumnName){
                this.crossColumnName = statusColumnName
            }
            if(statusColumnValue){
                this.crossColumnValue = statusColumnValue
            }
            this.form.storeupnum='0'
            this.form.thumbsupnum='0'
            this.form.crazilynum='0'
            this.formVisible = true
        }
        http.get(this.sessionTable+'/session').then(res=>{
            var json = res.data.data
        })
        http.get(`option/xinwenfenlei/xinwenfenlei`).then(res=>{
            this.xinwenfenleiLists = res.data.data
        })
    },
    getInfo(){
        http.get(`xinwenxinxi/info/${this.id}`).then(res=>{
            let reg=new RegExp('../../../upload','g')
            res.data.data.xinwenneirong = res.data.data.xinwenneirong?(res.data.data.xinwenneirong.replace(reg,'../../../cl4787468/upload')):'';
            this.form = res.data.data
            this.formVisible = true
        })
    },
    //重置表单
    resetForm(){
        Object.assign(this.$data,this.$options.data())
        this.form = {
            xinwenbiaoti: '',
            fengmian: '',
            xinwenfenlei: '',
            xinwenjianjie: '',
            xinwenneirong: '',
            faburiqi: '',
            storeupnum: '0',
            thumbsupnum: '0',
            crazilynum: '0',
        }
    },


        //封面上传回调
    fengmianUploadSuccess(e){
        this.form.fengmian = e
    },







    //关闭
    closeClick(){
        this.formVisible = false
    },
    //富文本
    editorChange(e,name){
        this.form[name] = e
    },
    //提交
    save(){
        if(this.form.fengmian!=null) {
            this.form.fengmian = this.form.fengmian.replace(new RegExp(baseUrl,"g"),"");
        }
        let objcross;
        let crossUserId = ''
        let crossRefId = ''
        let crossOptNum = ''
        if(this.type == 'cross'){
            objcross = JSON.parse(JSON.stringify(this.crossRow))
            if(this.crossColumnName!=''){
                if(!this.crossColumnName.startsWith('[')){
                    for(let o in objcross){
                        if(o == this.crossColumnName){
                            objcross[o] = this.crossColumnValue
                        }
                    }
                }else{
                    crossUserId = toolUtil.storageGet('userid')
                    crossRefId = objcross['id']
                    crossOptNum = this.crossColumnName.replace(/\[|\]/g,"")
                }
            }
        }
        this.$refs.formRef.validate((valid)=>{
            if(!valid)return
            if(crossUserId&&crossRefId){
                this.form.crossuserid = crossUserId
                this.form.crossrefid = crossRefId
                let params = {
                    page: 1,
                    limit: 1000,
                    crossuserid:this.form.crossuserid,
                    crossrefid:this.form.crossrefid,
                }
                http.get('xinwenxinxi/page',{
                    params:params
                }).then(res=>{
                    if(res.data.data.total>=crossOptNum){
                        return this.$message.error(this.crossTips)
                    }else{
                        http.post(`xinwenxinxi/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
                            if(this.type == 'cross'){
                                //修改跨表数据
                                this.changeCrossData(objcross)
                            }
                            this.$message.success('操作成功')
                            this.formVisible = false
                            this.$emit('change')
                        })
                    }
                })
            }else{
                http.post(`xinwenxinxi/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
                    if(this.type == 'cross'){
                        //修改跨表数据
                        this.changeCrossData(objcross)
                    }
                    this.$message.success('操作成功')
                    this.formVisible = false
                    this.$emit('change')
                })
            }
        })
    },
    changeCrossData(data){
         http.post(`${this.crossTable}/update`,data)
    },
},
})
document.write(`<script src="../../components/FileUpload.js"></script>`)
document.write(`<script src="${baseUrl}manage/static/modules/wangeditor/index.min.js"></script>`)
document.write(`<script src="../../components/myEditor.js"></script>`)
document.write(`<link rel="stylesheet" href="${baseUrl}manage/static/modules/wangeditor/style.css"></link>`)
