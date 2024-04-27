using Microsoft.AspNetCore.SignalR;
using Twilight.Chat.DataService;
using Twilight.Chat.Models;

namespace Twilight.Chat.Hubs;

public class ChatHub : Hub
{
    private readonly SharedDb _sharedDb;

    public ChatHub(SharedDb sharedDb)
    {
        _sharedDb = sharedDb;
    }

    public async Task JoinChat(UserConnection connection)
    {
        await Clients.All.SendAsync("ReceiveMessage", "admin", $"{connection.UserName} has joined");
    }

    public async Task JoinSpecificChatRoom(UserConnection connection)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, connection.ChatRoom);
        _sharedDb.Connections[Context.ConnectionId] = connection;
        await Clients.Group(connection.ChatRoom).SendAsync("ReceiveMessage", "admin",
            $"{connection.UserName} has joined {connection.ChatRoom}");
    }

    public async Task SendMessage(string message)
    {
        if (_sharedDb.Connections.TryGetValue(Context.ConnectionId, out var connection))
        {
            await Clients.Group(connection.ChatRoom).SendAsync("ReceiveSpecificMessage", connection.UserName, message);
        }
    }
}