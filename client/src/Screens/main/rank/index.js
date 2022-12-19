import { LoadingScreen, StackLayout } from 'components';
import { Text, View } from 'react-native-ui-lib';
import React, { useEffect, useState } from 'react';
import { PlayerRankCard } from 'screens/main/components';
import { showAlert } from 'utilities';
import { rankApi } from 'apis';
import { useAuth } from 'hooks';
import { useFocusEffect } from '@react-navigation/native';

export const RankScreen = () => {
    const [ranks, setRanks] = useState([]);
    const [rankOfUser, setRankOfUser] = useState();
    const [loading, setLoading] = useState(false);

    const getRanksOfGame = async game => {
        try {
            setLoading(true);
            const { ranks, rankOfUser } = await rankApi.getRanks(game);
            setRankOfUser(rankOfUser);
            setRanks(ranks);
        } catch (error) {
            showAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getRanksOfGame('puzzle');
        }, []),
    );

    return (
        <StackLayout textCenter={'Rank'}>
            {loading && <LoadingScreen />}
            <Text fs15 font-semiBold white>
                Top 10 best player
            </Text>
            <View paddingT-10>
                <View>
                    {ranks &&
                        ranks.slice(0, 10).map((item, index) => {
                            const isYou =
                                rankOfUser &&
                                rankOfUser.accountId === item.accountId;
                            return (
                                <PlayerRankCard
                                    isYou={isYou}
                                    key={index}
                                    item={item}
                                />
                            );
                        })}
                </View>
                {rankOfUser && rankOfUser.rank > 10 && (
                    <View>
                        <Text fs15 font-semiBold white center marginB-10>
                            .......
                        </Text>
                        <PlayerRankCard isYou item={rankOfUser} />
                    </View>
                )}
            </View>
        </StackLayout>
    );
};
