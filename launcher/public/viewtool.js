/**
 * Shared applist view rendering functionality
 * 
 * Author: Antonio Fiol-Mahon
 */

module.exports = {
    GROUP_STYLES: {
      default: {
        class_selected: "",
        color: "#ffffff",
        title: ""
      },
      classic: {
        class_selected: "list-group-item-success",
        color: "#28a745;",
        title: "Classic"
      },
      science: {
        class_selected: "active",
        color: "#007aff;",
        title: "Science"
      },
      summer2018: {
        class_selected: "list-group-item-warning",
        color: "#ffc108;",
        title: "Summer 2018"
      },
      hacks: {
        class_selected: "list-group-item-danger",
        color: "#dc3645;",
        title: "Hack"
      }
    },
    getGroupTitle: function(group_name) {
        group_name = (group_name != undefined) ? group_name: "default";
        return this.GROUP_STYLES[group_name]["title"];
    },
    getListElementStyle: function(group_name) {
        group_name = (group_name != undefined) ? group_name: "default";
        let color = this.GROUP_STYLES[group_name]["color"]
        return `border-left: 10px solid ${color}`;
    },
    getGroupSelectClass: function(group_name) {
        group_name = (group_name != undefined) ? group_name: "default";
        return this.GROUP_STYLES[group_name]["class_selected"];
    },

}