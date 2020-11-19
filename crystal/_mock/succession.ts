import _ from 'lodash';
import { MockRequest } from '@knz/mock';
import {
    genChineseString,
    genRangeInteger,
    genIntString,
    genGuid,
    genUniqueRangeArray,
    buildResponse,
    genString,
} from './generator';

const positionList = ['产品经理', '销售副总裁', '技术主管'];

const abilityList = (_.range(7) as []).map(() => {
    return {
        id: genGuid(),
        name: genChineseString(genRangeInteger(2, 9)),
    };
});

const experienceList = (_.range(5) as []).map(() => {
    return {
        id: genGuid(),
        name: genChineseString(genRangeInteger(2, 9)),
    };
});

const preparatoryStageList = [null, 'threemonth', 'sixmonth', 'ninemonth', 'twelvemonth'];

export const successionMap = {
    'project/GetProjectList': (req: MockRequest) => [],
    'Succession/GetSuccAtlasAll': (req: MockRequest) => {
        const data = (_.range(10) as number[]).map(() => ({
            empcode: genIntString(3, 'emp'),
            empname: genChineseString(3),
            positionid: genIntString(4, 'JD'),
            positionname: positionList[genRangeInteger(0, positionList.length)],
            recommendation: genRangeInteger(-1, 100),
            category: genRangeInteger(0, 3),
        }));

        return buildResponse(data);
    },
    'Succession/GetSuccPlanCompetencyModelDimension': (req: MockRequest) => {
        return buildResponse({
            abilitylist: _.cloneDeep(abilityList),
            experiencelist: _.cloneDeep(experienceList),
        });
    },
    'Succession/GetSuccPlan': (req: MockRequest) => {
        const sourceList = _.cloneDeep(abilityList).concat(_.cloneDeep(experienceList));

        function genStages() {
            const length = genRangeInteger(0, sourceList.length / 2) + 1;
            return genUniqueRangeArray(sourceList, length);
        }

        const data = (_.range(10) as number[]).map(() => ({
            empcode: genIntString(3, 'emp'),
            empname: genChineseString(3),
            positionid: genIntString(4, 'JD'),
            positionname: positionList[genRangeInteger(0, positionList.length)],
            category: genRangeInteger(0, 3),
            threemonth: genStages(),
            sixmonth: genStages(),
            ninemonth: genStages(),
            twelvemonth: genStages(),
            preparatorystage: preparatoryStageList[genRangeInteger(0, preparatoryStageList.length)],
        }));

        return buildResponse(data);
    },
    'Succession/SetSuccAltasCategory': () => {},
    'Succession/GetCustomerPositionMap': () => {
        function genPositionTree(count: number) {
            const positionIds = [];
            return (_.range(count) as number[]).map(() => {
                const pid = positionIds[genRangeInteger(0, positionIds.length)] || null;
                const position = {
                    projectid: genRangeInteger(0, 10) > 0 ? genGuid() : null,
                    positionid: genIntString(3, 'POS'),
                    positionname: genChineseString(4),
                    parentpositionid: pid,
                    organizationalid: genIntString(3, 'DEP'),
                    orgname: genChineseString(4),
                    empcount: genIntString(100),
                    iskeyposition: !!genRangeInteger(0, 2),
                    ishighrisk: !!genRangeInteger(0, 2),
                    succanalysisid: genRangeInteger(0, 10) > 0 ? 'succanalysisid' : null,
                };
                positionIds.push(position.positionid);
                return position;
            });
        }

        const treeCount = genRangeInteger(2, 5);

        const data = (_.range(treeCount) as number[]).map(() => {
            const treeNodeCount = genRangeInteger(2, 20);
            return genPositionTree(treeNodeCount);
        });

        return buildResponse(_.flatten(data));
    },
    'Succession/GetPositionEmployee': () => {
        return (_.range(40) as number[]).map(() => ({
            id: genIntString(5),
            customerid: genString(10),
            projectid: genGuid(),
            positionid: genIntString(3, 'POS'),
            positionname: genChineseString(4),
            organizationalid: genIntString(3, 'DEP'),
            orgname: genChineseString(4),
            headimg: null,
        }));
    },
};
