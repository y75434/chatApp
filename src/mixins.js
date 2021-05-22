export default {
  methods: {
    handleNotifications (channelId, currentChannelId, notifCount, snapshot) {
      let lastTotal = 0
      const index = notifCount.findIndex(el => el.id === channelId)
      if (index !== -1 && channelId !== currentChannelId && snapshot.numChildren() - lastTotal > 0) {
        lastTotal = notifCount[index].total
        notifCount[index].notif = snapshot.numChildren() - lastTotal
        notifCount[index].lastKnownTotal = snapshot.numChildren()
      } else {
        notifCount.push({
          id: channelId,
          total: snapshot.numChildren(),
          lastKnownTotal: snapshot.numChildren(),
          notif: 0
        })
      }
    }
  }
}
