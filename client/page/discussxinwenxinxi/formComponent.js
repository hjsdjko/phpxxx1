Vue.component('discussxinwenxinxi-form',{
    template: `
    <div>
        <el-dialog :fullscreen="false" width="80%"                    :visible.sync="formVisible"
                   :title="formTitle"
                   v-if="formVisible"
                   custom-class="formModel">
            <el-form ref="formRef" :model="form" class="formModel_form" :rules="rules" label-width="120px" >
                <el-form-item label="头像" prop="avatarurl" class="upload-item img-upload-item">
                    <file-upload
                            :disabled="!isAdd||disabledForm.avatarurl?true:false"
                            action="file/upload"
                            tip="请上传头像"
                            :limit="3"
                            :fileUrls="form.avatarurl?form.avatarurl:''"
                            @change="avatarurlUploadSuccess">
                    </file-upload>
                </el-form-item>
                <el-form-item label="用户名" prop="nickname" class="input-item">
                    <el-input v-model="form.nickname" placeholder="用户名"
                              type="text"
                        :readonly="!isAdd||disabledForm.nickname?true:false" ></el-input>
                </el-form-item>
                <el-form-item label="评论内容" prop="content" class="textarea-item">
                    <el-input v-model="form.content"
                              placeholder="评论内容"
                              type="textarea"
                              :autosize="{ minRows: 5}"
                              readonly
                    ></el-input>
                </el-form-item>
                <el-form-item label="回复内容" prop="reply" class="textarea-item">
                    <el-input v-model="form.reply"
                              placeholder="回复内容"
                              type="textarea"
                              :autosize="{ minRows: 5}"
                              :readonly="!isAdd||disabledForm.reply?true:false"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div v-if="isAdd||type=='reply'" class="formModel-btns">
                <el-button class="formModel_cancel" @click="closeClick">取消</el-button>
                <el-button class="formModel_confirm" type="primary" @click="save">
                    提交
                </el-button>
            </div>
        </el-dialog>
    </div>
`,
    data(){
        return{
            sessionTable:localStorage.getItem('sessionTable'),
            tableName:'discussxinwenxinxi',
            formName:'新闻信息评论表',
            formVisible:false,
            formTitle:'',
            form:{
                refid: '',
                userid: '',
                avatarurl: '',
                nickname: '',
                content: '',
                reply: '',
            },
            id:0,
            type:'',
            disabledForm:{
                refid : false,
                userid : false,
                avatarurl : false,
                nickname : false,
                content : false,
                reply : false,
            },
            isAdd:false,
            rules:{
                refid: [
                    {required: true,message: '请输入',trigger: 'blur'},
                ],
                userid: [
                    {required: true,message: '请输入',trigger: 'blur'},
                ],
                avatarurl: [
                ],
                nickname: [
                ],
                content: [
                    {required: true,message: '请输入',trigger: 'blur'},
                ],
                reply: [
                ],
            },
            crossRow:'',
            crossTable:'',
            crossTips:'',
            crossColumnName:'',
            crossColumnValue:'',
        }
    },
    watch:{
    },
    methods:{
        //获取唯一标识
        getUUID(){
            return new Date().getTime();
        },
        //头像上传回调
        avatarurlUploadSuccess(e){
        this.form.avatarurl = e
        },
        getInfo(){
            http.get(`${this.tableName}/info/${this.id}`).then(res=>{
                this.form = res.data.data
                this.formVisible = true
            })
        },
        init(formId=null,formType='add',formNames='',row=null,table=null,statusColumnName=null,tips=null,statusColumnValue=null){
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
                    if(x=='refid'){
                        this.form.refid = row[x];
                        this.disabledForm.refid = true;
                        continue;
                    }
                    if(x=='avatarurl'){
                        this.form.avatarurl = row[x];
                        this.disabledForm.avatarurl = true;
                        continue;
                    }
                    if(x=='nickname'){
                        this.form.nickname = row[x];
                        this.disabledForm.nickname = true;
                        continue;
                    }
                    if(x=='content'){
                        this.form.content = row[x];
                        this.disabledForm.content = true;
                        continue;
                    }
                    if(x=='reply'){
                        this.form.reply = row[x];
                        this.disabledForm.reply = true;
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
                this.formVisible = true
            }
        },
        //关闭
        closeClick(){
            this.formVisible = false
        },
        //提交
        save(){
            if(this.form.avatarurl!=null) {
                this.form.avatarurl = this.form.avatarurl.replace(new RegExp(baseUrl,"g"),"");
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
                    http.get('discussxinwenxinxi/page',{
                        params:params
                    }).then(res=>{
                        if(res.data.data.total>=crossOptNum){
                            return this.$message.error(this.crossTips)
                        }else{
                            http.post(`discussxinwenxinxi/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
                    http.post(`discussxinwenxinxi/${!this.form.id ? "save" : "update"}`,this.form).then(res=>{
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
    }
})
document.write(`<script src="../../components/FileUpload.js"></script>`)
document.write(`<script src="${baseUrl}client/static/modules/wangeditor/index.min.js"></script>`)
document.write(`<script src="../../components/myEditor.js"></script>`)
document.write(`<link rel="stylesheet" href="${baseUrl}client/static/modules/wangeditor/style.css"></link>`)
