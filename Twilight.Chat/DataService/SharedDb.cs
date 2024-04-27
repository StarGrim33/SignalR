using System.Collections.Concurrent;
using Twilight.Chat.Models;

namespace Twilight.Chat.DataService;

public class SharedDb
{
    private readonly ConcurrentDictionary<string, UserConnection> _connections = new();

    public ConcurrentDictionary<string, UserConnection> Connections => _connections;
}