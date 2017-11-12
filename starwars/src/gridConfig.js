
class GridConfig {
    constructor(){
         this.config = GridConfig.getConfigurations();
    }
    static getConfigurations(){
        return {
            title: "Star Wars",
            keyColumn: "peopleName",
            enableFilter: true,
            rowHeight: "35",
            columns:[
                {
                    headerName: "Characters",
                    field:"peopleName",
                    headerTooltip: "Characters",
                    filter: "text",
                },
                {
                    headerName: "Gender",
                    field:"gender",
                    headerTooltip: "Gender",
                    filter: "text",
                },
                {
                    headerName: "Birth Year",
                    field:"birthyear",
                    headerTooltip: "Birth Year",
                    filter: "text",
                },
                {
                    headerName: "Movie Title",
                    field:"title",
                    headerTooltip: "Film Tilte",
                    filter: "text",
                }
            ]
        }
    }
}
module.exports = GridConfig;