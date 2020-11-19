import PerfectScrollbar from 'perfect-scrollbar';

export class ScrollBarHelper {
    public static makeScrollbar(ele: any, options?): PerfectScrollbar {
        return new PerfectScrollbar(ele, options);
    }
}
