import { $el } from "../../../scripts/ui.js";
import { myInfoDialog } from "../dialog/myInfoPage.js";

export const myInfoBtn = info => {
    return $el('div.menus-item.menus-item-key', {
        onclick: () => myInfoDialog(info),
    }, ['My Info'])
}