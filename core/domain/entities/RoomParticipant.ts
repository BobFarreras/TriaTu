export class RoomParticipant {
  constructor(
    public readonly userId: string,
    public readonly joinedAt: Date = new Date()
  ) {}
}