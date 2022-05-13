import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import color from '@/styles/color.scss';

import SvgIconEmail from '../assets/icons/noun_email.svg'
import SvgIconContact from '../assets/icons/noun_contact.svg'
import SvgIconPerson from '../assets/icons/noun-person.svg'
import SvgIconPhone from '../assets/icons/noun-phone.svg'
import SvgIconAddress from '../assets/icons/address.svg'
import SvgIconMore from '../assets/icons/noun-more.svg'
import SvgIconLocation from '../assets/icons/location.svg'
import SvgIconPlusWhite from '../assets/icons/noun-plus-white.svg'
import SvgIconDownArrow from '../assets/icons/noun-down-arrow.svg'
import SvgIconLock from '../assets/icons/noun-lock.svg'
import SvgIconFingerPrint from '../assets/icons/noun-finger-print.svg'
import SvgIconWorldMap from '../assets/icons/noun-world-map.svg'
import SvgIconExclamation from '../assets/icons/noun-exclamation.svg'
import SvgIconTimer from '../assets/icons/noun-timer.svg'
import SvgIconCard from '../assets/icons/noun-card.svg'
import SvgIconCursor from '../assets/icons/noun-cursor.svg'
import SvgIconShield from '../assets/icons/noun-shield.svg'
import SvgIconUpArrow from '../assets/icons/noun-up-arrow.svg'
import SvgIconSchedule from '../assets/icons/noun-schedule.svg'
import SvgIconGear from '../assets/icons/noun-gear.svg'
import SvgIconChevronRight from '../assets/icons/noun-chevron-right.svg'
import SvgIconDotArrow from '../assets/icons/noun-dot-arrow.svg'
import SvgIconActivity from '../assets/icons/noun-activity.svg'
import SvgIcon3Stars from '../assets/icons/noun-3-stars.svg'
import SvgIconPlusBlack from '../assets/icons/noun-plus-black.svg'
import SvgIconForwardArrow from '../assets/icons/noun-forward-arrow.svg'
import SvgIconUndo from '../assets/icons/noun_Undo.svg'
import SvgIconPlus from '../assets/icons/noun_Plus.svg'
import SvgIconOn from '../assets/icons/noun_on.svg'
import SvgIconCalendar from '../assets/icons/noun_calendar.svg'
import SvgIconStatus from '../assets/icons/noun_status.svg'
import SvgIconChange from '../assets/icons/noun_change.svg'
import SvgIconTick from '../assets/icons/tick.svg'
import SvgIconCompany from '../assets/icons/noun_company.svg'
import SvgIconSettings from '../assets/icons/settings_tumbler_black.svg'
import SvgIconUsers from '../assets/icons/noun-user.svg'
import SvgIconDoc from '../assets/icons/noun_doc.svg'
import SvgIconTag from '../assets/icons/tag.svg'
import SvgIconSelect from '../assets/icons/noun-select.svg'
import SvgIconLink from '../assets/icons/noun-link.svg'
import SvgIconDetails from '../assets/icons/details.svg'
import SvgIconFix from '../assets/icons/fix.svg'
import SvgSideView from '../assets/icons/side-view.svg'
import SvgBottomView from '../assets/icons/bottom-view.svg'
import SvgResearch from '../assets/icons/research.svg'
import SvgIconCursorRight from '../assets/icons/noun-cursor-right.svg'
import SvgIconEye from '../assets/icons/eye.svg'
import SvgIconUserAccount from '../assets/icons/user-account.svg'
import SvgIconUserAccountEmpty from '../assets/icons/user-account-empty.svg'
import SvgIconTrending from '../assets/icons/trending.svg'
import SvgIconHamburger from '../assets/icons/card-hamburger.svg'
import SvgIconLike from '../assets/icons/like.svg'
import SvgIconSearch from '../assets/icons/search.svg'
import SvgIconFacebook from '../assets/icons/facebook-footer.svg'
import SvgIconInstagram from '../assets/icons/instagram-footer.svg'
import SvgLinkedin from '../assets/icons/linkedin-footer.svg'
import SvgIconTwitter from '../assets/icons/twitter-footer.svg'
import SvgIconYoutube from '../assets/icons/youtube-footer.svg'
import SvgIconGreenArrow from '../assets/icons/green-arrow.svg'
import SvgIconArrowLeft from '../assets/icons/arrow-left.svg'
import SvgIconLabel from '../assets/icons/label-green.svg'
import SvgBraapLogo from '../assets/img/logo-white.svg'
import SvgBriefcaseClock from '../assets/icons/briefcase.svg'
import SvgCursorClick from '../assets/icons/click.svg'
import SvgTextBoxEdit from '../assets/icons/text-box-edit-outline.svg'


Vue.use(Vuetify);

export default new Vuetify({
    breakpoint: {
        scrollBarWidth: 10
    },
    icons: {
        values: {
            'svg-email': { component: SvgIconEmail },
            'svg-contact': { component: SvgIconContact },
            'svg-person': { component: SvgIconPerson },
            'svg-phone': { component: SvgIconPhone },
            'svg-address': { component: SvgIconAddress },
            'svg-more': { component: SvgIconMore },
            'svg-location': { component: SvgIconLocation },
            'svg-plus-white': { component: SvgIconPlusWhite },
            'svg-down-arrow': { component: SvgIconDownArrow },
            'svg-lock': { component: SvgIconLock },
            'svg-finger-print': { component: SvgIconFingerPrint },
            'svg-world-map': { component: SvgIconWorldMap },
            'svg-exclamation': { component: SvgIconExclamation },
            'svg-timer': { component: SvgIconTimer },
            'svg-card': { component: SvgIconCard },
            'svg-cursor': { component: SvgIconCursor },
            'svg-shield': { component: SvgIconShield },
            'svg-up-arrow': { component: SvgIconUpArrow },
            'svg-schedule': { component: SvgIconSchedule },
            'svg-gear': { component: SvgIconGear },
            'svg-chevron-right': { component: SvgIconChevronRight },
            'svg-dot-arrow': { component: SvgIconDotArrow },
            'svg-activity': { component: SvgIconActivity },
            'svg-3-stars': { component: SvgIcon3Stars },
            'svg-plus-black': { component: SvgIconPlusBlack },
            'svg-forward-arrow': { component: SvgIconForwardArrow },
            'svg-plus': { component: SvgIconPlus },
            'svg-undo': { component: SvgIconUndo },
            'svg-on': { component: SvgIconOn },
            'svg-calendar': { component: SvgIconCalendar },
            'svg-status': { component: SvgIconStatus },
            'svg-change': { component: SvgIconChange },
            'svg-tick': { component: SvgIconTick },
            'svg-company': { component: SvgIconCompany },
            'svg-settings': { component: SvgIconSettings },
            'svg-users': { component: SvgIconUsers },
            'svg-doc': { component: SvgIconDoc },
            'svg-tag': { component: SvgIconTag },
            'svg-select': { component: SvgIconSelect },
            'svg-link': { component: SvgIconLink },
            'svg-details': { component: SvgIconDetails },
            'svg-fix': { component: SvgIconFix },
            'svg-side-view': { component: SvgSideView },
            'svg-bottom-view': { component: SvgBottomView },
            'svg-research': { component: SvgResearch },
            'svg-cursor-right': { component: SvgIconCursorRight },
            'svg-eye': { component: SvgIconEye },
            'svg-user-account': { component: SvgIconUserAccount },
            'svg-user-account-empty': { component: SvgIconUserAccountEmpty },
            'svg-trending': { component: SvgIconTrending },
            'svg-hamburger': { component: SvgIconHamburger },
            'svg-like': { component: SvgIconLike },
            'svg-search': { component: SvgIconSearch },
            'svg-facebook': { component: SvgIconFacebook },
            'svg-instagram': { component: SvgIconInstagram },
            'svg-linkedin': { component: SvgLinkedin },
            'svg-twitter': { component: SvgIconTwitter },
            'svg-youtube': { component: SvgIconYoutube },
            'svg-braap-logo': { component: SvgBraapLogo },
            'svg-green-arrow': { component: SvgIconGreenArrow },
            'svg-arrow-left': { component: SvgIconArrowLeft },
            'svg-label': { component: SvgIconLabel },
            'svg-briefcase-clock': { component: SvgBriefcaseClock },
            'svg-cursor-click': { component: SvgCursorClick },
            'svg-text-box-edit': { component: SvgTextBoxEdit }
        }
    },
    theme: {
        themes: {
            light: {
                primary: '#000',
                braap_grey: color.braap_grey,
                braap_bg_grey: color.braap_bg_grey,
                braap_light_grey: color.braap_light_grey,
                braap_green: color.braap_green,
                braap_red: color.braap_red,
                braap_yellow: color.braap_yellow,
                braap_blue: color.braap_blue,
                braap_light_blue: color.braap_light_blue,
                braap_part: color.braap_part,
                braap_light_part: color.braap_light_part,
                braap_deep_blue: color.braap_deep_blue,
                braap_orange: color.braap_orange,
                success: color.success
            },
            dark: {
                primary: '#000',
                braap_grey: color.braap_grey,
                braap_bg_grey: color.braap_bg_grey,
                braap_light_grey: color.braap_light_grey,
                braap_green: color.braap_green,
                braap_red: color.braap_red,
                braap_yellow: color.braap_yellow,
                braap_blue: color.braap_blue,
                braap_light_blue: color.braap_light_blue,
                braap_part: color.braap_part,
                braap_light_part: color.braap_light_part,
                braap_deep_blue: color.braap_deep_blue,
                braap_orange: color.braap_orange
            },
        },
    }
});
