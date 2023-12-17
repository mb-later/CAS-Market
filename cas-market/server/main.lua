local JayCore = exports["qb-core"]:GetCoreObject()


local function Content(source,data)
    local retval = false
    local items = data.item
    local price = data.price
    local method = data.method
    local xPlayer = GetPlayer(source)
      local Player = QbCore.Functions.GetPlayer(src)

    if not xPlayer then print("Error Code 18, Open ticket") return end
    for i,j in pairs(items) do
        for k in pairs(CAS.Items) do
            if j.name == CAS.Items[k].label then
                local checkItem =  exports['qb-inventory']:RemoveItem(Player.PlayerData.source, "CBdiamond", price, false)

                
                if checkItem then AddItem(source, k, j.count) retval = true end
            end
        end
    end
    return retval
end

if CAS.Framework == "qb" then
    QBCore.Functions.CreateCallback("cas-server:BuyProducts",function(source,cb,data) 
        local check = Content(source, data)
        cb(check)
    end)
elseif CAS.Framework == "esx" then
    ESX.RegisterServerCallback("cas-server:BuyProducts",function(source,cb,data) 
        local check = Content(source, data)
        cb(check)
    end)
end

