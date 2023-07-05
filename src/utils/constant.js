import IMG_RES from '../assets/images/res_res.png';
import IMG_EGG from '../assets/images/res_egg.png';
import IMG_GBAKS from '../assets/images/res_gbaks.png';
import IMG_GOLDMINE from '../assets/images/gold_mine.png';
import IMG_URANIUM from '../assets/images/uranium_mine.png';
import IMG_PREMIUM from '../assets/images/premium.png';
import IMG_LANDS from '../assets/images/lands.png';
import IMG_POWERPLANT from '../assets/images/power_plant.png';
import IMG_MINEMODULE from '../assets/images/mining_module.png';

export const FIELDS = [
  {
    name: 'Gold Mine',
    avatar: IMG_GOLDMINE,
    desc: 'Start Date',
    type: 'date',
  },
  {
    name: 'Uranium Mine',
    avatar: IMG_URANIUM,
    desc: 'Start Date',
    type: 'date',
  },
  {
    name: 'Premium',
    avatar: IMG_PREMIUM,
    desc: 'Start Date',
    type: 'date',
  },
  {
    name: 'Lands',
    avatar: IMG_LANDS,
    desc: 'Land Number',
    type: 'array',
  },
  {
    name: 'Power Plant',
    avatar: IMG_POWERPLANT,
    desc: 'Start Date',
    type: 'date',
  },
  {
    name: 'Mining Module',
    avatar: IMG_MINEMODULE,
    desc: 'Start Date',
    type: 'date',
  },
  {
    name: 'Gbaks',
    avatar: IMG_GBAKS,
    desc: 'Amount',
    type: 'number',
  },
  {
    name: 'Res',
    avatar: IMG_RES,
    desc: 'Amount',
    type: 'number',
  },
  {
    name: 'Eggs',
    avatar: IMG_EGG,
    desc: 'Amount',
    type: 'number',
  },
];
