<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-cascades'></i> 用例维护
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='handle-box'>
                <el-button
                    type='primary'
                    icon='el-icon-delete'
                    class='handle-del mr10'
                    @click='newCase'
                >新增用例
                </el-button>
                <el-button
                    type='primary'
                    icon='el-icon-delete'
                    class='handle-del mr10'
                    @click='delAllSelection'
                >批量删除
                </el-button>
                <el-select v-model='query.level' placeholder='用例级别' class='handle-select mr10'>
                    <el-option key='1' label='--用例级别--' disabled></el-option>
                    <el-option key='2' label='level0' value='0'></el-option>
                    <el-option key='3' label='level1' value='1'></el-option>
                    <el-option key='4' label='level2' value='2'></el-option>
                </el-select>
                <el-select v-model='query.state' placeholder='用例状态' class='handle-select mr10'>
                    <el-option key='1' label='--用例状态--' disabled></el-option>
                    <el-option key='2' label='正常' value='0'></el-option>
                    <el-option key='3' label='删除' value='1'></el-option>
                </el-select>
                <el-input v-model='query.id' placeholder='用例编号' class='handle-input mr10'></el-input>
                <el-button type='primary' icon='el-icon-search' @click='handleSearch'>搜索</el-button>
            </div>
            <el-table
                :data='tableData'
                border
                class='table'
                ref='multipleTable'
                header-cell-class-name='table-header'
                @selection-change='handleSelectionChange'
            >
                <el-table-column type='selection' width='55' align='center'></el-table-column>
                <el-table-column prop='ID' label='用例ID' width='55' align='center'></el-table-column>
                <el-table-column prop='SERIAL_NO' label='用例名字'></el-table-column>
                <el-table-column prop='LEVEL' label='用例级别'></el-table-column>
                <el-table-column prop='DESCRIPTION' label='用例描述'></el-table-column>
                <el-table-column prop='REQUEST_METHOD' label='请求方法'></el-table-column>
                <el-table-column prop='REQUEST_HEADERS' label='请求头'></el-table-column>
                <el-table-column prop='REQUEST_BODY' label='请求体'></el-table-column>
                <el-table-column prop='CREATE_TIME' label='创建时间'></el-table-column>
                <el-table-column prop='UPDATE_TIME' label='更新时间'></el-table-column>
                <el-table-column label='操作' width='180' align='center'>
                    <template slot-scope='scope'>
                        <el-button
                            type='text'
                            icon='el-icon-edit'

                            @click='handleEdit(scope.$index, scope.row)'
                        >编辑
                        </el-button>
                        <el-button
                            type='text'
                            icon='el-icon-delete'
                            class='red'
                            @click='handleDelete(scope.$index, scope.row)'
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class='pagination'>
                <el-pagination
                    background
                    layout='total, prev, pager, next'
                    :current-page='query.pageIndex'
                    :page-size='query.pageSize'
                    :total='pageTotal'
                    @current-change='handlePageChange'
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title='编辑' :visible.sync='editVisible' width='100%'>
            <el-form ref='form' :model='form' label-width='70px'>
                <el-form-item label='用户名'>
                    <el-input v-model='form.name'></el-input>
                </el-form-item>
                <el-form-item label='地址'>
                    <el-input v-model='form.address'></el-input>
                </el-form-item>
            </el-form>
            <span slot='footer' class='dialog-footer'>
                <el-button @click='editVisible = false'>取 消</el-button>
                <el-button type='primary' @click='saveEdit'>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchAllCase } from '../../api/index';

export default {
    name: 'BaseCase',
    data() {
        return {
            query: {
                level: '',
                state: '',
                id: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            fetchAllCase(this.query).then(res => {
                console.log(res);

                this.tableData = res.list;
                this.pageTotal = res.pageTotal || 0;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {
                });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        newCase() {
            this.$router.push('/form');
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>