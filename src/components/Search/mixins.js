export default {
    data() {
        return {
            pageSize: 4
        }
    },
    mounted() {
        if (this.$refs.container)
            this.setPageSize()
    },
    methods: {
        setPageSize() {
            var height = window.innerHeight - this.$refs.container.offsetTop
            var width = this.$refs.container.offsetWidth
            var rowNum = 4
            if (width > 1399) rowNum = 4
            else if (width > 991) rowNum = 3
            else if (width > 767) rowNum = 2
            else rowNum = 1

            if (rowNum > 1) {
                var colNum = Math.ceil(height / 410)
                colNum = colNum <= 1 ? 2 : colNum
                this.pageSize = rowNum * colNum
            } else {
                this.pageSize = 4
            }
        }
    }
}