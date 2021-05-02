export const Constants = {
    webClientId: "561885653033-j09ov4bbrghlcuk1osq0nk1gh6gtebjg.apps.googleusercontent.com",
    baseUrl: "http://127.0.0.1:8080"
};

export const PublisherChannel = {
    tripJoined: (tripId: string) => `${tripId}-trip_joined`,
    tripStarted: (tripId: string) => `${tripId}-trip_started`,
    tripFinished: (tripId: string) => `${tripId}-trip_finished`,
    tripCancelled: (tripId: string) => `${tripId}-trip_cancelled`,
    tripLocationUpdate: (tripId: string) => `${tripId}-location_update`,
    newMessage: (tripId: string) => `${tripId}-new_message`,
}