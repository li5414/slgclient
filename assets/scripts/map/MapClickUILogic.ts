import ArmyCommand from "../general/ArmyCommand";
import { ArmyData } from "../general/ArmyProxy";
import { MapBuildAscription, MapBuildData } from "./MapBuildProxy";
import { MapCityData } from "./MapCityProxy";
import MapCommand from "./MapCommand";
import { MapResConfig, MapResData } from "./MapProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapClickUILogic extends cc.Component {
    @property(cc.Label)
    labelName: cc.Label = null;
    @property(cc.Label)
    labelPos: cc.Label = null;
    @property(cc.Label)
    labelYield: cc.Label = null;
    @property(cc.Label)
    labelSoldierCnt: cc.Label = null;
    @property(cc.Button)
    btnMove: cc.Button = null;
    @property(cc.Button)
    btnOccupy: cc.Button = null;
    @property(cc.Button)
    btnGiveUp: cc.Button = null;

    protected _data: any = null;
    protected onLoad(): void {

    }

    protected onDestroy(): void {
        cc.systemEvent.targetOff(this);
    }

    protected onClickGiveUp(): void {
        MapCommand.getInstance().giveUpBuild(this._data.x, this._data.y);
        this.node.parent = null;
    }

    protected onClickMove(): void {
        let myCity: MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let armyData: ArmyData = ArmyCommand.getInstance().proxy.getFirstArmy(myCity.cityId);
        if (armyData == null) {
            console.log("没有队伍");
        } else {
            // ArmyCommand.getInstance().generalAssignArmy(armyData.id, 1, this._data.x, this._data.y, myCity);.
            cc.systemEvent.emit("open_general_dispose", myCity, this._data,2);
        }
        this.node.parent = null;
    }

    protected onClickOccupy(): void {
        let myCity: MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
        let armyData: ArmyData = ArmyCommand.getInstance().proxy.getFirstArmy(myCity.cityId);
        if (armyData == null) {
            console.log("没有队伍");
        } else {
            // ArmyCommand.getInstance().generalAssignArmy(armyData.id, 1, this._data.x, this._data.y, myCity);.
            cc.systemEvent.emit("open_general_dispose", myCity, this._data,1);
        }
        this.node.parent = null;
    }

    public setCellData(data: any, pixelPos: cc.Vec2): void {
        this._data = data;
        let resData: MapResData = MapCommand.getInstance().proxy.getResData(this._data.id);
        let resCfg: MapResConfig = MapCommand.getInstance().proxy.getResConfig(resData.type);
        this.labelName.string = resCfg.name;
        this.labelPos.string = "(" + data.x + ", " + data.y + ")";
        this.labelYield.string = MapCommand.getInstance().proxy.getResYieldDesList(resCfg).join("\n");
        this.labelSoldierCnt.string = "守备兵力 x" + (resData.level * 100);
        if (this._data instanceof MapResData) {
            //点击的是野外
            this.btnMove.node.active = false;
            this.btnOccupy.node.active = true;
            this.btnGiveUp.node.active = false;
        } else if (this._data instanceof MapBuildData) {
            //点击的是占领地
            if ((this._data as MapBuildData).ascription == MapBuildAscription.Me) {
                //我自己的地
                this.btnMove.node.active = true;
                this.btnOccupy.node.active = false;
                this.btnGiveUp.node.active = true;
            } else {
                this.btnMove.node.active = false;
                this.btnOccupy.node.active = false;
                this.btnGiveUp.node.active = false;
            }
        }
    }
}