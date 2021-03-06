/**
 * @license
 * Copyright Color-Coding Studio. All Rights Reserved.
 *
 * Use of this source code is governed by an Apache License, Version 2.0
 * that can be found in the LICENSE file at http://www.apache.org/licenses/LICENSE-2.0
 */
namespace initialfantasy {
    export namespace ui {
        export namespace c {
            /** 列表视图-应用程序元素 */
            export class ApplicationElementListView extends ibas.BOListView implements app.IApplicationElementListView {
                /** 返回查询的对象 */
                get queryTarget(): any {
                    return bo.ApplicationElement;
                }
                /** 编辑数据，参数：目标数据 */
                editDataEvent: Function;
                /** 删除数据事件，参数：删除对象集合 */
                deleteDataEvent: Function;
                /** 注册元素 */
                registerElementsEvent: Function;
                /** 绘制视图 */
                draw(): any {
                    let that: this = this;
                    this.table = new sap.ui.table.Table("", {
                        enableSelectAll: false,
                        selectionBehavior: sap.ui.table.SelectionBehavior.Row,
                        visibleRowCount: ibas.config.get(openui5.utils.CONFIG_ITEM_LIST_TABLE_VISIBLE_ROW_COUNT, 15),
                        visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Interactive,
                        rows: "{/rows}",
                        columns: [
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_applicationelement_objectkey"),
                                template: new sap.m.Text("", {
                                    wrapping: false
                                }).bindProperty("text", {
                                    path: "objectKey"
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_privilege_moduleid"),
                                template: new sap.m.ex.BOText("", {
                                    boText: "moduleName",
                                    boKey: "moduleId",
                                    boCode: ibas.config.applyVariables(bo.BO_CODE_APPLICATIONMODULE),
                                    repositoryName: bo.BO_REPOSITORY_INITIALFANTASY,
                                    bindingValue: {
                                        path: "moduleId"
                                    }
                                }),
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_applicationelement_elementtype"),
                                template: new sap.m.Text("", {
                                    wrapping: false
                                }).bindProperty("text", {
                                    path: "elementType",
                                    formatter(data: any): any {
                                        return ibas.enums.describe(bo.emElementType, data);
                                    }
                                })
                            }),
                            new sap.ui.table.Column("", {
                                label: ibas.i18n.prop("bo_applicationelement_elementname"),
                                template: new sap.m.Text("", {
                                    wrapping: false
                                }).bindProperty("text", {
                                    path: "elementName",
                                })
                            }),
                        ]
                    });
                    // 添加列表自动查询事件
                    openui5.utils.triggerNextResults({
                        listener: this.table,
                        next(data: any): void {
                            if (ibas.objects.isNull(that.lastCriteria)) {
                                return;
                            }
                            let criteria: ibas.ICriteria = that.lastCriteria.next(data);
                            if (ibas.objects.isNull(criteria)) {
                                return;
                            }
                            ibas.logger.log(ibas.emMessageLevel.DEBUG, "result: {0}", criteria.toString());
                            that.fireViewEvents(that.fetchDataEvent, criteria);
                        }
                    });
                    let page: sap.m.Page = new sap.m.Page("", {
                        showHeader: false,
                        subHeader: new sap.m.Toolbar("", {
                            content: [
                                /*
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_new"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://create",
                                    press: function (): void {
                                        that.fireViewEvents(that.newDataEvent);
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_view"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://display",
                                    press: function (): void {
                                        that.fireViewEvents(that.viewDataEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.ApplicationElement>(that.table).firstOrDefault()
                                        );
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_edit"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://edit",
                                    press: function (): void {
                                        that.fireViewEvents(that.editDataEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.ApplicationElement>(that.table).firstOrDefault()
                                        );
                                    }
                                }),
                                new sap.m.ToolbarSeparator(""),
                                */
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("shell_data_delete"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://delete",
                                    press: function (): void {
                                        that.fireViewEvents(that.deleteDataEvent,
                                            // 获取表格选中的对象
                                            openui5.utils.getSelecteds<bo.ApplicationElement>(that.table)
                                        );
                                    }
                                }),
                                new sap.m.Button("", {
                                    text: ibas.i18n.prop("initialfantasy_register_elements"),
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://activate",
                                    press: function (): void {
                                        that.fireViewEvents(that.registerElementsEvent);
                                    }
                                }),
                                new sap.m.ToolbarSpacer(""),
                                new sap.m.Button("", {
                                    type: sap.m.ButtonType.Transparent,
                                    icon: "sap-icon://action",
                                    press: function (event: any): void {
                                        ibas.servicesManager.showServices({
                                            proxy: new ibas.BOListServiceProxy({
                                                data: openui5.utils.getSelecteds(that.table),
                                                converter: new bo.DataConverter(),
                                            }),
                                            displayServices(services: ibas.IServiceAgent[]): void {
                                                if (ibas.objects.isNull(services) || services.length === 0) {
                                                    return;
                                                }
                                                let popover: sap.m.Popover = new sap.m.Popover("", {
                                                    showHeader: false,
                                                    placement: sap.m.PlacementType.Bottom,
                                                });
                                                for (let service of services) {
                                                    popover.addContent(new sap.m.Button({
                                                        text: ibas.i18n.prop(service.name),
                                                        type: sap.m.ButtonType.Transparent,
                                                        icon: service.icon,
                                                        press: function (): void {
                                                            service.run();
                                                            popover.close();
                                                        }
                                                    }));
                                                }
                                                (<any>popover).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");
                                                popover.openBy(event.getSource(), true);
                                            }
                                        });
                                    }
                                })
                            ]
                        }),
                        content: [
                            new sap.ui.layout.form.SimpleForm("", {
                                content: [
                                    this.table,
                                ]
                            })
                        ]
                    });
                    return page;
                }
                private table: sap.ui.table.Table;
                /** 显示数据 */
                showData(datas: bo.ApplicationElement[]): void {
                    let done: boolean = false;
                    let model: sap.ui.model.Model = this.table.getModel(undefined);
                    if (!ibas.objects.isNull(model)) {
                        // 已存在绑定数据，添加新的
                        let hDatas: any = (<any>model).getData();
                        if (!ibas.objects.isNull(hDatas) && hDatas.rows instanceof Array) {
                            for (let item of datas) {
                                hDatas.rows.push(item);
                            }
                            model.refresh(false);
                            done = true;
                        }
                    }
                    if (!done) {
                        // 没有显示数据
                        this.table.setModel(new sap.ui.model.json.JSONModel({ rows: datas }));
                    }
                    this.table.setBusy(false);
                }
                /** 记录上次查询条件，表格滚动时自动触发 */
                query(criteria: ibas.ICriteria): void {
                    super.query(criteria);
                    // 清除历史数据
                    if (this.isDisplayed) {
                        this.table.setBusy(true);
                        this.table.setFirstVisibleRow(0);
                        this.table.setModel(null);
                    }
                }
            }
        }
    }
}
