import { observer } from "mobx-react-lite";
import React from "react";
import { useRootStore } from "../../common/RootStoreProvider";
import { TripStatus } from "../../service/service.trip";
import { OngoingTripInfo } from "./OngoingTripInfo";
import { OngoingTripMapView } from "./OngoingTripMapView";

interface Props {
    onFabPress(): void
}

export const HomeOngoingTrip = observer((props: Props) => {

    const storeTrip = useRootStore().storeTrip;

    if (storeTrip.joinedTrip?.status === TripStatus.PLANNED)
        return <OngoingTripInfo trip={storeTrip.joinedTrip} />

    if (storeTrip.joinedTrip?.status === TripStatus.STARTED)
        return <OngoingTripMapView onFabPress={props.onFabPress} />

    return null;
});