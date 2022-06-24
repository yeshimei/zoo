import CardManager from './CardManager'
import Feature from './Feature'
import ItemCard from './ItemCard'

export default class PutCard extends ItemCard {
  static putCards = []
  constructor() {
    super()
    this.type = 'putCard'
  }
}

// 海绵墙
class SpongeWall extends PutCard {
  static name = '海绵墙'
  constructor() {
    super()
    this.name = SpongeWall.name
    this.summary =
      '剩余的骰子点数小，碰到墙壁反弹（反向移动），剩余的骰子点数大，撞破墙壁（正常通行） '
    this.feature = Feature.Create('障碍物', this)
  }

  put() {}
}
// 石墙
class StoneWall extends PutCard {
  static name = '石墙'
  constructor() {
    super()
    this.name = StoneWall.name
    this.summary = '骰子点数最大点，翻越（正常通行） '
    this.feature = Feature.Create('障碍物', this)
    this.being = 'permanent'
  }
  put() {}
}

// 地雷
class Landmine extends PutCard {
  static name = '地雷'
  constructor() {
    super()
    this.name = Landmine.name
    this.summary = '离开后爆炸（中心格受到两点伤害，相邻格受到一点伤害） '
    this.combinationSummary = '爆炸物：受到伤害变为消耗红心'
    this.feature = Feature.Create('爆炸物', this)
    this.combination = true
  }

  put() {
    this.registerAction(this.grid, {
      judge: this._hasRole(),
      trigger(grid) {
        let consume = grid.adjacent().hasFeature('爆炸物')
        grid.center().damage(2, consume)
        grid.adjacent().damage(1, consume)
      }
    })
  }

  beforeDestroy() {
    this.feature.trigger(this.grid)
  }
}

// 炸药
class Dynamite extends PutCard {
  static name = '炸药'
  constructor() {
    super()
    this.name = Dynamite.name
    this.summary = '碰到 火， 爆炸（中心格受到两点伤害，相邻格受到一点伤害）'
    this.combinationSummary = '爆炸物：受到伤害变为消耗红心'
    this.feature = Feature.Create('爆炸物', this)
    this.combination = true
  }

  put() {
    this.registerAction(this.grid, {
      judge: this._hasItemCard('火'),
      trigger(grid) {
        let consume = grid.adjacent().hasFeature('爆炸物')
        grid.center().damage(2, consume)
        grid.adjacent().damage(1, consume)
      }
    })
  }

  beforeDestroy() {
    this.feature.trigger(this.grid)
  }
}
// 遥感炸弹
class RemoteSensingBomb extends PutCard {
  static name = '遥感炸弹'
  constructor() {
    super()
    this.name = RemoteSensingBomb.name
    this.summary = '碰到 电力， 爆炸（中心格受到两点伤害，相邻格受到一点伤害）'
    this.combinationSummary = '爆炸物：受到伤害变为消耗红心'
    this.feature = Feature.Create('爆炸物', this)
    this.combination = true
  }

  put() {}

  beforeDestroy() {}
}

// 高爆手雷
class HighExplosiveGrenade extends PutCard {
  static name = '高爆手雷'
  constructor() {
    super()
    this.name = HighExplosiveGrenade.name
    this.summary = '投掷（两格以内），爆炸（中心格受到一点伤害） '
    this.combinationSummary = '爆炸物：受到伤害变为消耗红心'
    this.feature = Feature.Create('爆炸物', this)
    this.combination = true
    this.pelt = true
    this.depletion = true

    this.range = 'twoAdjacentGrid'
  }

  put() {}

  beforeDestroy() {}
}
// 燃烧瓶
class MolotovCocktail extends PutCard {
  static name = '燃烧瓶'
  constructor() {
    super()
    this.name = MolotovCocktail.name
    this.feature = Feature.Create('火元素', this)
    this.summary = '投掷（两格以内），变成 火'
    this.pelt = true
    this.depletion = true
    this.range = 'twoAdjacent'
  }

  put() {
    this.registerAction(this.grid, {
      judge: this._hasRole(),
      trigger() {
        return CardManager.take('火')
      }
    })
  }
}

// 油桶
class OilDrum extends PutCard {
  static name = '油桶'
  constructor() {
    super()
    this.name = OilDrum.name
    this.feature = Feature.Create('易燃物', this)
    this.summary = '附着油 '
    this.being = 'permanent'
  }

  put() {}
}
// 酒精
class Alcohol extends PutCard {
  static name = '酒精'
  constructor() {
    super()
    this.name = Alcohol.name
    this.feature = Feature.Create('易燃物', this)
    this.summary = '投掷 （两格以内），自燃（变成 火 ） '

    this.pelt = true
    this.depletion = true
    this.range = 'twoAdjacentGrid'
  }

  put() {}
}
// 雾霾
class Smog extends PutCard {
  static name = '雾霾'
  constructor() {
    super()
    this.name = Smog.name
    this.feature = Feature.Create('有毒物', this)
    this.summary = '感染（中心格受到三点伤害）'
  }

  put() {}
}
// 吹矢
class Fukiya extends PutCard {
  static name = '吹矢'
  constructor() {
    super()
    this.name = Fukiya.name
    this.feature = Feature.Create('有毒物', this)
    this.summary = '吹射（两格以内），形成 毒素'
    this.pelt = true
    this.depletion = true
    this.range = 'twoAdjacentGrid'
  }

  put() {}
}
// 生命树
class LifeTree extends PutCard {
  static name = '生命树'
  constructor() {
    super()
    this.name = LifeTree.name
    this.feature = Feature.Create('植物', this)
    this.summary = ''
    this.exchangeSummary = '水：增加一颗蓝心；种子：增加一颗红心'
    this.exchange = true
    this.being = 'permanent'
  }

  put() {}

  newMethod() {
    return this
  }
}
// 蒲公英
class Dandelion extends PutCard {
  static name = '蒲公英'
  constructor() {
    super()
    this.name = Dandelion.name
    this.summary = '附着 种子 和 风'
    this.feature = Feature.Create('植物', this)
  }

  put() {}
}
// 芦荟
class Aloe extends PutCard {
  static name = '芦荟'
  constructor() {
    super()
    this.name = Aloe.name
    this.summary = '恢复一颗红心'
    this.exchangeSummary = '种子：额外恢复一颗红心'
    this.feature = Feature.Create('植物', this)
    this.exchange = true
    this.being = 'permanent'
  }

  put() {}
}
// 鱼腥草
class HouttuyniaCordata extends PutCard {
  static name = '鱼腥草'
  constructor() {
    super()
    this.name = HouttuyniaCordata.name
    this.summary = '周围格的治疗效果翻倍 '
    this.exchangeSummary = '种子： 附着 腥草叶'
    this.feature = Feature.Create('植物', this)
    this.exchange = true
    this.being = 'permanent'
  }

  put() {}

  beforeDestroy() {}
}
// 毒伞
class Umbrella extends PutCard {
  static name = '毒伞'
  constructor() {
    super()
    this.name = Umbrella.name
    this.summary = '剧毒（中心格减少一颗红心） '
    this.feature = Feature.Create('植物', this)
    this.being = 'permanent'
  }

  put() {}
}
// 罂粟
class Poppy extends PutCard {
  static name = '罂粟'
  constructor() {
    super()
    this.name = Poppy.name
    this.summary = '成瘾（中心格消耗一颗红心）'
    this.feature = Feature.Create('植物', this)
    this.being = 'permanent'
  }

  put() {}
}
// 电池
class Battery extends PutCard {
  static name = '电池'
  constructor() {
    super()
    this.name = Battery.name
    this.summary = '为一张主动符文牌充能'
    this.feature = Feature.Create('电力', this)
    this.pelt = true
    this.depletion = true

    this.range = 'twoAdjacentGrid'
  }

  put() {}
}
// 电磁炮
class ElectromagneticGun extends PutCard {
  static name = '电磁炮'
  constructor() {
    super()
    this.name = ElectromagneticGun.name
    this.summary = '中心格受到一点伤害 '
    this.combinationSummary =
      '电力 ：周围格（ 电力 所在格除外）受到一点伤害 电力'
    this.feature = Feature.Create('电力', this)
    this.combination = true
    this.being = 'permanent'
  }

  put() {}
}
// 电磁手雷
class ElectromagneticGrenade extends PutCard {
  static name = '电磁手雷'
  constructor() {
    super()
    this.name = ElectromagneticGrenade.name
    this.summary = '电力 向四周扩散，覆盖上中下三层直线区域'
    this.feature = Feature.Create('电力', this)
    this.pelt = true
    this.depletion = true

    this.range = 'twoAdjacentGrid'
  }

  put() {}
}
// 水流
class WaterRound extends PutCard {
  static name = '水流'
  constructor() {
    super()
    this.name = WaterRound.name
    this.summary = ' 附着 水;顺流（不消耗骰子点数），逆流（骰子点数翻倍） '
    this.combinationSummary = '水流： 经过的角色会被强制在 水流 中移动'
    this.feature = Feature.Create('水元素', this)
    this.combination = true
    this.direction = 1
    this.being = 'permanent'
  }

  put() {}
}
// 水球
class WaterPolo extends PutCard {
  static name = '水球'
  constructor() {
    super()
    this.name = WaterPolo.name
    this.summary = '投掷（两格以内） ，形成 水'
    this.feature = Feature.Create('水元素', this)
    this.pelt = true
    this.depletion = true

    this.range = 'twoAdjacentGrid'
  }

  put() {}
}
// 冰冻手雷
class FrozeGrenade extends PutCard {
  static name = '冰冻手雷'
  constructor() {
    super()
    this.name = FrozeGrenade.name
    this.summary = '投掷（两格以内），变成 冰'
    this.feature = Feature.Create('冰元素', this)
    this.pelt = true
    this.depletion = true

    this.range = 'twoAdjacentGrid'
  }

  put() {}
}
// 龙卷风
class Tornado extends PutCard {
  static name = '龙卷风'
  constructor() {
    super()
    this.name = Tornado.name
    this.summary =
      '摧毁（直接消失）周围格的放置物；吹飞（向四周移一格）周围格的角色'
    this.feature = Feature.Create('风元素', this)
    this.being = 'permanent'
  }

  put() {}
}
// 灯泡
class LightBulb extends PutCard {
  static name = '灯泡'
  constructor() {
    super()
    this.name = LightBulb.name
    this.summary = '照明（中心格） '
    this.combinationSummary = '电力 ：周围格'
    this.feature = Feature.Create('光元素', this)
    this.combination = true
    this.being = 'permanent'
  }

  put() {}
}
// 低温火把
class LowTemperatureTorch extends PutCard {
  static name = '低温火把'
  constructor() {
    super()
    this.name = LowTemperatureTorch.name
    this.summary = '照明（中心格）'
    this.combinationSummary = '火元素 ：周围格'
    this.feature = Feature.Create('光元素', this)
    this.combination = true
    this.being = 'permanent'
  }

  put() {}
}
// 照明弹
class Flares extends PutCard {
  static name = '照明弹'
  constructor() {
    super()
    this.name = Flares.name
    this.summary = '发射（两格以内），照明（周围格）'
    this.feature = Feature.Create('光元素', this)
    this.pelt = true
    this.depletion = true

    this.range = 'twoAdjacentGrid'
    this.being = 'move'
  }

  put() {}
}
// 暗物质
class DarkMatter extends PutCard {
  static name = '暗物质'
  constructor() {
    super()
    this.name = DarkMatter.name
    this.summary = '暗元素 充斥所在行与列'
    this.feature = Feature.Create('暗元素', this)
    this.being = 'permanent'
  }

  put() {}
}
// 东风快递
class DongfengExpress extends PutCard {
  static name = '东风快递'
  constructor() {
    super()
    this.name = DongfengExpress.name
    this.summary = '发射一枚导弹（直线两格）受到一点伤害 '
    this.combinationSummary = '易燃物 ：三格；爆炸物 ：额外发射一枚导弹'
    this.combination = true
    this.being = 'permanent'
    this.direction = 1
  }
  put() {}
}
// 狙击枪
class SniperRifle extends PutCard {
  static name = '狙击枪'
  constructor() {
    super()
    this.name = SniperRifle.name
    this.summary = '精准狙击（指定直线一格至六格其中一格）受到一点伤害 '
    this.combinationSummary = '具有特性的放置物：子弹附加其特性'
    this.combination = true
    this.being = 'permanent'
    this.direction = 1
  }
  put() {}
}
// 震撼弹
class ShockBullet extends PutCard {
  static name = '震撼弹'
  constructor() {
    super()
    this.name = ShockBullet.name
    this.summary = '投掷（两格以内），眩晕（中心格停留一回合）'
    this.pelt = true
    this.depletion = true

    this.range = 'twoAdjacentGrid'
  }
  put() {}
}
// 绷带
class Bandage extends PutCard {
  static name = '绷带'
  constructor() {
    super()
    this.name = Bandage.name
    this.summary = '恢复一颗红心'
  }

  put() {}
}
// 补给箱
class SupplyBox extends PutCard {
  static name = '补给箱'
  constructor() {
    super()
    this.name = SupplyBox.name
    this.summary = "补给物品牌数量等于（一颗）骰子点数'"
  }

  put() {}
}
// 飞机场
class Airport extends PutCard {
  static name = '飞机场'
  constructor() {
    super()
    this.name = Airport.name
    this.summary = '在中心格产生 电力 '
    this.combinationSummary = '电塔：处于水平线或垂直线之间的区域会产生 电力'
    this.combination = true
  }

  put() {}
}
// 跳板
class Springboard extends PutCard {
  static name = '跳板'
  constructor() {
    super()
    this.name = Springboard.name
    this.summary = '跳跃（剩余的骰子点数翻倍）'
  }

  put() {}
}
// 梯子
class Ladder extends PutCard {
  static name = '梯子'
  constructor() {
    super()
    this.name = Ladder.name
    this.summary = '翻越 障碍物'
  }

  put() {}
}
// 木筏
class Raft extends PutCard {
  static name = '木筏'
  constructor() {
    super()
    this.name = Raft.name
    this.summary = '在中心格产生 电力 '
    this.combinationSummary = '电塔：处于水平线或垂直线之间的区域会产生 电力'
    this.combination = true
  }

  put() {}
}
// 电塔
class ElectricTower extends PutCard {
  static name = '电塔'
  constructor() {
    super()
    this.name = ElectricTower.name
    this.summary = '在中心格产生 电力 '
    this.combinationSummary = '电塔：处于水平线或垂直线之间的区域会产生 电力'
    this.feature = Feature.Create('电力', this)
    this.combination = true
    this.being = 'permanent'
  }

  put() {}

  beforeDestroy() {}
}

PutCard.putCards = [
  SpongeWall,
  StoneWall,
  Landmine,
  Dynamite,
  MolotovCocktail,
  RemoteSensingBomb,
  HighExplosiveGrenade,
  OilDrum,
  Alcohol,
  Smog,
  Fukiya,
  LifeTree,
  ElectricTower,
  Dandelion,
  Aloe,
  HouttuyniaCordata,
  Umbrella,
  Poppy,
  Battery,
  ElectricTower,
  ElectromagneticGun,
  ElectromagneticGrenade,
  WaterRound,
  WaterPolo,
  FrozeGrenade,
  MolotovCocktail,
  Tornado,
  LightBulb,
  LowTemperatureTorch,
  Flares,
  DarkMatter,
  DongfengExpress,
  SniperRifle,
  ShockBullet,
  Bandage,
  SupplyBox,
  Airport,
  Springboard,
  Ladder,
  Raft
]
