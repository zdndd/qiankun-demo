import _ from 'lodash';
import { Injectable } from '@angular/core';
import { TransferItem } from 'ng-zorro-antd';
import { isDef } from '@utils/check';

export class UserBase {
    userid: string;
    username: string;
}

@Injectable({
    providedIn: 'root',
})
export class TransferHandleService {
    convertLeftUsers(userList: UserBase[], filter: (user: UserBase) => boolean) {
        return userList.filter(filter).map((user) => ({
            key: user.userid,
            group: {
                key: user.userid,
                title: user.username,
            },
            direction: 'left',
            title: user.username,
        }));
    }

    convertRightUsers(userList: UserBase[], rightUsers: any[], key: string, title: string) {
        if (rightUsers == null || rightUsers.length <= 0) {
            return [
                {
                    key,
                    title,
                    group: { key, title },
                    direction: 'right',
                },
            ];
        }

        return rightUsers.map((rightUser) => {
            const user = userList.find(({ userid }) => userid === (rightUser.userid || rightUser));

            return {
                key: rightUser.userid || rightUser,
                group: {
                    key: key,
                    title: title,
                },
                direction: 'right',
                title: isDef(user, 'username') ? user.username : rightUser.username || rightUser,
            };
        });
    }
}
